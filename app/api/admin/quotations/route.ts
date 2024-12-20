// app/api/admin/quotations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QuotationStatus, Role } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    // Parse and adjust dates to handle timezone issues
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined;
    let endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined;

    // Adjust end date to include the entire day
    if (endDate) {
      endDate = new Date(endDate.setHours(23, 59, 59, 999));
    }

    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Add date range filter if dates are provided
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Debug log
    console.log("Query parameters:", {
      startDate,
      endDate,
      sortBy,
      sortOrder,
      page,
      limit,
      skip,
      where,
    });

    // First, let's check if we have any quotations at all
    const totalQuotations = await prisma.quotation.count();
    console.log("Total quotations in database:", totalQuotations);

    // Now let's check how many match our where clause
    const matchingQuotations = await prisma.quotation.count({ where });
    console.log("Matching quotations:", matchingQuotations);

    try {
      const [quotations, total] = await Promise.all([
        prisma.quotation.findMany({
          where,
          orderBy: {
            createdAt: sortOrder,
          },
          skip,
          take: limit,
          include: {
            creator: {
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

      console.log("Query results:", {
        quotationsFound: quotations.length,
        totalCount: total,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });

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
