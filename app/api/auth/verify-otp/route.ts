// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signJwtAccessToken } from '@/app/lib/jwt';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find the verification token and associated user
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: otp,
        expires: {
          gt: new Date()
        },
        user: {
          email: email
        }
      },
      include: {
        user: true
      }
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid OTP or OTP has expired' },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Update user, delete verification token, and create password reset token
    await prisma.$transaction([
      // Update user
      prisma.user.update({
        where: { 
          id: verificationToken.userId 
        },
        data: {
          emailVerified: new Date(),
        }
      }),
      // Delete verification token
      prisma.verificationToken.delete({
        where: { 
          id: verificationToken.id 
        }
      }),
      // Delete any existing password reset tokens
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: verificationToken.userId
        }
      }),
      // Create new password reset token
      prisma.passwordResetToken.create({
        data: {
          token: otp, // Use the same OTP for password reset
          expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
          userId: verificationToken.userId
        }
      })
    ]);

    try {
      const accessToken = await signJwtAccessToken({
        id: verificationToken.user.id,
        email: verificationToken.user.email,
        role: verificationToken.user.role
      });

      return NextResponse.json(
        {
          message: 'Email verified successfully',
          user: {
            id: verificationToken.user.id,
            email: verificationToken.user.email,
            name: verificationToken.user.name,
            emailVerified: true
          },
          accessToken,
          resetToken: otp // Include the same OTP to be used for password reset
        },
        { status: 200 }
      );
    } catch (jwtError) {
      console.error('JWT generation error:', jwtError);
      return NextResponse.json(
        { error: 'Authentication token generation failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
