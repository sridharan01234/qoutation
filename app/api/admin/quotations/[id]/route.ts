import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QuotationStatus, Role } from "@prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const { action } = data;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const quotation = await prisma.quotation.update({
      where: { id: params.id },
      data: {
        status: action === "approve" ? QuotationStatus.APPROVED : QuotationStatus.REJECTED,
        activities: {
          create: {
            type: action === "approve" ? "APPROVED" : "REJECTED",
            description: `Quotation ${action}d by admin`,
            userId: session.user.id,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: quotation.creater.id,
        title: `Quotation ${action === "approve" ? "Approved" : "Rejected"}`,
        message: `Your quotation ${quotation.quotationNumber} has been ${
          action === "approve" ? "approved" : "rejected"
        } by an admin.`,
        type: action === "approve" ? "QUOTATION_APPROVED" : "QUOTATION_REJECTED",
      },
    });

    return NextResponse.json({ success: true, data: quotation });
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