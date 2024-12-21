import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateOTP } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Generate OTP
    const otp = generateOTP();
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    // Store OTP in database with expiry
    await prisma.verificationToken.create({
      data: {
        token: otp,
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        user: {
          connectOrCreate: {
            where: { email },
            create: {
              email,
              password: await bcrypt.hash(otp, 10), // temporary password, should be changed later
              name: email.split('@')[0], // optional: create a default name
            }
          }
        }
      }
    });

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        minVersion: 'TLSv1.2',
        ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${otp}`,
    });

    return NextResponse.json({ 
      message: "OTP sent successfully",
      email 
    }, { status: 200 });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ 
      error: "Failed to send OTP" 
    }, { status: 500 });
  }
}
