import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { action } = await request.json();

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json(
        { success: false, error: "Invalid action provided" },
        { status: 400 }
      );
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { creator: true },
    });

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: "Quotation not found" },
        { status: 404 }
      );
    }

    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
    const updatedQuotation = await prisma.quotation.update({
      where: { id },
      data: {
        status: newStatus,
        statusChangedBy: session.user.id,
        activities: {
          create: {
            type: "STATUS_CHANGE",
            description: `Quotation ${action}d by admin`,
            userId: session.user.id
          }
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      quotation: updatedQuotation 
    });

  }
  catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}