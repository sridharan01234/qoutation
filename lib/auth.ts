import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { compare } from "bcrypt";
import bcrypt from 'bcryptjs'
import { randomBytes } from 'node:crypto'

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      async profile(profile) {
        // Search for existing user in database
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            firstName: true,
            lastName: true,
            displayName: true,
            image: true,
            isActive: true,
          },
        })

        if (existingUser) {
          // If user exists and is active, return their database info
          if (!existingUser.isActive) {
            throw new Error("Account is deactivated")
          }

          return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image,
            role: existingUser.role,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            displayName: existingUser.displayName,
          }
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER",
          firstName: profile.given_name,
          lastName: profile.family_name,
          displayName: profile.name,
          emailVerified: new Date(),
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              image: true,
              firstName: true,
              lastName: true,
              displayName: true,
              isActive: true,
            },
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isActive) {
            throw new Error("Account is deactivated");
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (existingUser) {
            // Link the Google account to the existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type!,
                provider: account.provider,
                providerAccountId: account.providerAccountId!,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            })

            // Update existing user's info
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                lastLoginAt: new Date(),
                image: user.image || existingUser.image,
              },
            })

            if (!existingUser.isActive) {
              return false
            }

            return true
          } else {

            const randomPassword = randomBytes(32).toString('hex')
            const hashedPassword = await bcrypt.hash(randomPassword, 10)
            
            

            // Create new user if they don't exist
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                role: "USER",
                firstName: profile?.given_name,
                lastName: profile?.family_name,
                displayName: user.name,
                emailVerified: new Date(),
                isActive: true,
                lastLoginAt: new Date(),
                password: hashedPassword, // Add the random password here
              },
            })

            // Create the associated account
            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type!,
                provider: account.provider,
                providerAccountId: account.providerAccountId!,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            })

            return true
          }
        }
        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.name = user.name
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.displayName = user.displayName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.displayName = token.displayName as string
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      // Update last login time
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })
    },
  },
};
