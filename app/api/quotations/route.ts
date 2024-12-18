// app/api/quotations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { generateQuotationNumber } from "@/lib/utils";
import { QuotationStatus, PaymentTerms } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Prepare filter conditions
    const where = {
      userId: session.user.id,
      ...(status && { status }),
      ...(search && {
        OR: [
          { quotationNumber: { contains: search } },
          { notes: { contains: search } },
        ],
      }),
    };

    // Get total count for pagination
    const total = await prisma.quotation.count({ where });

    // Get quotations with related data
    const quotations = await prisma.quotation.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
        activities: {
          orderBy: {
            createdAt: "desc",
          },
        },
        attachments: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    // Return response
    return NextResponse.json({
      quotations,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error in quotations API:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log("Received data:", data);

    if (!data || !data.items || !Array.isArray(data.items)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // First verify the user exists
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const quotationNumber = await generateQuotationNumber();

    const quotationData = {
      quotationNumber,
      userId: session.user.id,
      date: new Date(),
      validUntil: new Date(data.validUntil),
      status: QuotationStatus.DRAFT,
      subtotal: data.subtotal,
      taxRate: data.taxRate || 0,
      taxAmount: data.taxAmount || 0,
      discount: data.discount || 0,
      discountType: data.discountType,
      shippingCost: data.shippingCost || 0,
      totalAmount: data.totalAmount,
      notes: data.notes || null,
      terms: data.terms || null,
      paymentTerms: PaymentTerms.IMMEDIATE,
      currency: data.currency || "USD",
      revisionNumber: 0,
      items: {
        create: data.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          tax: item.tax || 0,
          total: item.total,
          notes: item.notes || null,
        })),
      },
    };

    // Use a transaction to ensure data consistency
    const quotation = await prisma.$transaction(async (tx) => {
      const newQuotation = await tx.quotation.create({
        data: quotationData,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      await tx.activity.create({
        data: {
          quotationId: newQuotation.id,
          userId: session.user.id,
          type: "CREATED",
          description: `Quotation ${newQuotation.quotationNumber} was created`,
        },
      });

      return newQuotation;
    });

    return NextResponse.json({
      success: true,
      data: quotation,
    });
  } catch (error: any) {
    console.error("API Error:", error);

    // Improved error handling
    const errorMessage = error.message || "Server error";
    const statusCode = error.code === "P2003" ? 400 : 500; // P2003 is Prisma's foreign key constraint error

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: error.code,
      },
      { status: statusCode }
    );
  }
}
