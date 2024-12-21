// app/api/admin/quotations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

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

    // Parse dates and set to start of day and end of day
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined;
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined;

    // Get status from query params
    const status = searchParams.get("status") as QuotationStatus | null;

    // Set start date to beginning of day (00:00:00)
    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
    }

    // Set end date to end of day (23:59:59.999)
    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
    const skip = (page - 1) * limit;

    // Build where clause with all filters
    let where: any = {};

    // Add conditions to where clause
    const conditions: any[] = [];

    // Add date range condition if dates are provided
    if (startDate && endDate) {
      conditions.push({
        date: {
          gte: startDate,
          lte: endDate,
        },
      });
    }

    // Add status condition if status is provided
    if (status) {
      conditions.push({
        status: status,
      });
    }

    // Combine all conditions with AND
    if (conditions.length > 0) {
      where = {
        AND: conditions,
      };
    }

    // Log the query parameters for debugging
    console.log("Query Parameters:", {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      status,
      where,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    try {
      const [quotations, total] = await Promise.all([
        prisma.quotation.findMany({
          where,
          orderBy: {
            [sortBy]: sortOrder,
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
            approver: {
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

      // Log the results for debugging
      console.log("Query Results:", {
        totalQuotations: total,
        returnedQuotations: quotations.length,
        firstQuotationDate: quotations[0]?.date,
        lastQuotationDate: quotations[quotations.length - 1]?.date,
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
