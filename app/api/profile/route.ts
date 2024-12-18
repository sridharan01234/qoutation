import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Validation schema
const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  // Business Info
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  linkedinUrl: z.string().url().optional().nullable(),
  websiteUrl: z.string().url().optional().nullable(),

  // Address
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),

  // Preferences
  language: z.string().default("en"),
  timezone: z.string().default("UTC"),
  currency: z.string().default("USD"),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),

  // Password (optional)
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate input data
    const validatedData = ProfileSchema.parse(data);

    // Handle password update
    if (validatedData.newPassword && validatedData.currentPassword) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      const isValid = await bcrypt.compare(
        validatedData.currentPassword,
        user?.password || ""
      );

      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      validatedData.password = await bcrypt.hash(validatedData.newPassword, 12);
    }

    // Remove password fields from update data
    const { currentPassword, newPassword, ...updateData } = validatedData;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        phoneNumber: true,
        dateOfBirth: true,
        gender: true,
        company: true,
        jobTitle: true,
        department: true,
        linkedinUrl: true,
        websiteUrl: true,
        address: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        language: true,
        timezone: true,
        currency: true,
        emailNotifications: true,
        smsNotifications: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Profile update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error.code === "P2002" ? "Email already exists" : "Update failed",
      },
      { status: error.code === "P2002" ? 400 : 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        phoneNumber: true,
        dateOfBirth: true,
        gender: true,
        company: true,
        jobTitle: true,
        department: true,
        linkedinUrl: true,
        websiteUrl: true,
        address: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        language: true,
        timezone: true,
        currency: true,
        emailNotifications: true,
        smsNotifications: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
