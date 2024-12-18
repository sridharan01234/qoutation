// app/api/admin/quotations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QuotationStatus, Role } from "@prisma/client";

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Add search conditions
    if (search) {
      where.OR = [
        { quotationNumber: { contains: search } },
        {
          user: {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
            ],
          },
        },
      ];
    }

    // Add status filter
    if (status !== "all") {
      where.status = status as QuotationStatus;
    }

    // Add date range filter
    if (startDate && endDate) {
      try {
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        // Ensure valid dates
        if (!isNaN(startDateTime.getTime()) && !isNaN(endDateTime.getTime())) {
          where.createdAt = {
            gte: startDateTime,
            lte: endDateTime,
          };
        }
      } catch (error) {
        console.error("Date parsing error:", error);
      }
    }

    // Validate sort field
    const validSortFields = [
      "createdAt",
      "quotationNumber",
      "totalAmount",
      "status",
      "updatedAt",
    ];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

    try {
      // Execute queries
      const [quotations, total] = await Promise.all([
        prisma.quotation.findMany({
          where,
          orderBy: {
            [finalSortBy]: sortOrder,
          },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                  },
                },
              },
            },
            activities: {
              take: 5,
              orderBy: {
                createdAt: "desc",
              },
            },
            attachments: true,
          },
        }),
        prisma.quotation.count({ where }),
      ]);

      // Return response
      return NextResponse.json({
        success: true,
        quotations,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (prismaError) {
      console.error("Prisma Error:", prismaError);
      return NextResponse.json(
        {
          success: false,
          error: "Database query failed",
          details:
            process.env.NODE_ENV === "development" ? prismaError : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
