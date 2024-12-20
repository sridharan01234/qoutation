import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { QuotationStatus } from "@prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id: params.id },
      include: { creator: true }
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    if (quotation.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to modify this quotation" },
        { status: 403 }
      );
    }

    if (quotation.status !== QuotationStatus.DRAFT) {
      return NextResponse.json(
        { error: "Only draft quotations can be sent for approval" },
        { status: 400 }
      );
    }

    const updatedQuotation = await prisma.quotation.update({
      where: { id: params.id },
      data: {
        status: QuotationStatus.PENDING,
        activities: {
          create: {
            type: "STATUS_CHANGE",
            description: "Quotation sent for approval",
            userId: session.user.id
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      quotation: updatedQuotation
    });
  } catch (error) {
    console.error("Error sending quotation for approval:", error);
    return NextResponse.json(
      { error: "Failed to send quotation for approval" },
      { status: 500 }
    );
  }
}