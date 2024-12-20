import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {prisma} from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/utils/notificationService";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const quotation = await prisma.quotation.findUnique({
      where: {
        id: params.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        activities: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        attachments: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: "Quotation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quotation,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const quotation = await prisma.quotation.update({
      where: { id: params.id },
      data: {
        ...data,
        items: {
          deleteMany: {},
          create: data.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            tax: item.tax,
            total: item.total,
            notes: item.notes,
          })),
        },
        activities: {
          create: {
            type: "UPDATE",
            description: "Quotation updated",
            userId: session.user.id,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: quotation,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}