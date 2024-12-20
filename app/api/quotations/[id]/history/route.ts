import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const activities = await prisma.activity.findMany({
      where: {
        quotationId: params.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ data: activities });
  } catch (error) {
    console.error("Error fetching quotation history:", error);
    return NextResponse.json(
      { error: "Error fetching quotation history" },
      { status: 500 }
    );
  }
}