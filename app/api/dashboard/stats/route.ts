// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "../../auth/[...nextauth]/route";
import { ProductStatus, QuotationStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      productStats,
      quotationStats,
      totalProducts,
      totalQuotations,
      totalUsers,
      recentQuotations,
      topProducts,
      activityStats,
      notificationStats,
      attachmentStats,
      quotationValueStats,
    ] = await Promise.all([
      // Product status counts
      prisma.product.groupBy({
        by: ["status"],
        _count: true,
      }),

      // Quotation status counts
      prisma.quotation.groupBy({
        by: ["status"],
        _count: true,
      }),

      // Total products
      prisma.product.count(),

      // Total quotations
      prisma.quotation.count(),

      // Total users
      prisma.user.count({
        where: {
          role: "USER",
        },
      }),

      // Recent quotations with items and activities
      prisma.quotation.findMany({
        take: 5,
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
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
          activities: {
            take: 3,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      }),

      // Top selling products
      prisma.quotationItem.groupBy({
        by: ["productId"],
        _sum: {
          quantity: true,
          total: true,
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      }),

      // Recent activities
      prisma.activity.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          quotation: {
            select: {
              quotationNumber: true,
            },
          },
        },
      }),

      // Notification stats
      prisma.notification.groupBy({
        by: ["read"],
        _count: true,
      }),

      // Attachment stats
      prisma.attachment.aggregate({
        _sum: {
          fileSize: true,
        },
        _count: true,
      }),

      // Quotation value stats by status
      prisma.quotation.groupBy({
        by: ["status"],
        _sum: {
          totalAmount: true,
        },
      }),
    ]);

    // Initialize status counts with zeros
    const productsByStatus = Object.values(ProductStatus).reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<ProductStatus, number>
    );

    const quotationsByStatus = Object.values(QuotationStatus).reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<QuotationStatus, number>
    );

    // Fill in actual counts
    productStats.forEach((stat) => {
      productsByStatus[stat.status] = stat._count;
    });

    quotationStats.forEach((stat) => {
      quotationsByStatus[stat.status] = stat._count;
    });

    // Calculate unread notifications
    const unreadNotifications =
      notificationStats.find((stat) => !stat.read)?._count || 0;

    // Calculate total storage used by attachments
    const totalStorageUsed = attachmentStats._sum.fileSize || 0;

    // Calculate quotation values by status
    const quotationValues = quotationValueStats.reduce((acc, stat) => {
      acc[stat.status] = stat._sum.totalAmount || 0;
      return acc;
    }, {} as Record<QuotationStatus, number>);

    return NextResponse.json({
      summary: {
        totalProducts,
        totalQuotations,
        totalUsers,
        totalStorageUsed,
        unreadNotifications,
      },
      productsByStatus,
      quotationsByStatus,
      quotationValues,
      recentQuotations: recentQuotations.map((q) => ({
        id: q.id,
        quotationNumber: q.quotationNumber,
        date: q.date,
        status: q.status,
        totalAmount: q.totalAmount,
        currency: q.currency,
        user: q.user,
        itemCount: q.items.length,
        recentActivities: q.activities,
      })),
      topProducts: await Promise.all(
        topProducts.map(async (p) => {
          const product = await prisma.product.findUnique({
            where: { id: p.productId },
            select: { name: true, sku: true },
          });
          return {
            ...product,
            totalQuantity: p._sum.quantity,
            totalValue: p._sum.total,
          };
        })
      ),
      recentActivities: activityStats.map((activity) => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        createdAt: activity.createdAt,
        quotationNumber: activity.quotation.quotationNumber,
      })),
      notifications: {
        total: notificationStats.reduce((acc, stat) => acc + stat._count, 0),
        unread: unreadNotifications,
      },
      attachments: {
        count: attachmentStats._count,
        totalSize: totalStorageUsed,
      },
    });
  } catch (error) {
    console.error("Error in dashboard stats API:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
