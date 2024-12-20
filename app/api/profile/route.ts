// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

// Define the validation schema
const ProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).nullable().optional(),
  
  // Business Info
  company: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  websiteUrl: z.string().url().optional().nullable(),
  
  // Address
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  
  // Preferences
  language: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  
  // Password update fields
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
}).partial();

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let data;
    try {
      data = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate the input data
    const validatedData = ProfileSchema.parse(data);

    // Prepare update data
    const updateData: any = {};

    // Process each field
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        // Handle date fields
        if (key === 'dateOfBirth' && value) {
          try {
            updateData[key] = new Date(value);
          } catch (e) {
            throw new Error('Invalid date format');
          }
        }
        // Handle URL fields
        else if (['linkedinUrl', 'websiteUrl'].includes(key)) {
          updateData[key] = value === '' ? null : value;
        }
        // Handle boolean fields
        else if (['emailNotifications', 'smsNotifications'].includes(key)) {
          updateData[key] = Boolean(value);
        }
        // Handle other fields
        else if (!['currentPassword', 'newPassword'].includes(key)) {
          updateData[key] = value === '' ? null : value;
        }
      }
    });

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

      updateData.password = await bcrypt.hash(validatedData.newPassword, 12);
    }

    // Only proceed if there are changes
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: false,
        error: "No changes provided",
      }, { status: 400 });
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isActive: true,
        firstName: true,
        lastName: true,
        displayName: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        address: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        company: true,
        jobTitle: true,
        department: true,
        language: true,
        timezone: true,
        currency: true,
        emailNotifications: true,
        smsNotifications: true,
        linkedinUrl: true,
        twitterUrl: true,
        websiteUrl: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
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
        error: error.message || "Update failed",
      },
      { status: 500 }
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
