
import NextAuth from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Helper function to get session in API routes
export async function getAuthSession() {
  return await getServerSession(authOptions);
}
