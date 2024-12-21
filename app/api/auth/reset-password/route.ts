// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    // Input validation
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP and new password are required' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Find reset token with user verification
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: otp,
        expires: {
          gt: new Date(), // Check if token hasn't expired
        },
        user: {
          email: email, // Verify the token belongs to the correct user
        }
      },
      include: {
        user: true,
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and delete reset token in a transaction
    await prisma.$transaction([
      // Update user password
      prisma.user.update({
        where: { 
          id: resetToken.userId 
        },
        data: { 
          password: hashedPassword,
          updatedAt: new Date() // Track password update time
        },
      }),
      // Delete the used reset token
      prisma.passwordResetToken.delete({
        where: { 
          id: resetToken.id 
        },
      }),
      // Delete any other reset tokens for this user
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: resetToken.userId,
          id: {
            not: resetToken.id
          }
        }
      })
    ]);

    return NextResponse.json(
      {
        message: 'Password reset successfully',
        email: resetToken.user.email
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
