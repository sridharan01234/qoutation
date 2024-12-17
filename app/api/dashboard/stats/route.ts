// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalProducts,
      totalCustomers,
      totalQuotations,
      activeCustomers,
      productsByStatus,
      quotationsByStatus,
      recentQuotations,
      lowStockProducts
    ] = await Promise.all([
      // Get total products
      prisma.product.count(),
      
      // Get total customers
      prisma.customer.count(),
      
      // Get total quotations
      prisma.quotation.count(),
      
      // Get active customers
      prisma.customer.count({
        where: { isActive: true }
      }),
      
      // Get products by status
      prisma.product.groupBy({
        by: ['status'],
        _count: true
      }),
      
      // Get quotations by status
      prisma.quotation.groupBy({
        by: ['status'],
        _count: true
      }),
      
      // Get recent quotations
      prisma.quotation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { name: true }
          }
        }
      }),
      
      // Get low stock products
      prisma.product.findMany({
        where: { status: 'LOW_STOCK' },
        take: 5,
        orderBy: { stock: 'asc' }
      })
    ]);

    // Calculate total revenue (example calculation)
    const revenue = await prisma.quotation.aggregate({
      where: { status: 'APPROVED' },
      _sum: { totalAmount: true }
    });

    return NextResponse.json({
      totalProducts,
      totalCustomers,
      totalQuotations,
      activeCustomers,
      revenue: revenue._sum.totalAmount || 0,
      productsByStatus: productsByStatus.reduce((acc, curr) => ({
        ...acc,
        [curr.status]: curr._count
      }), {}),
      quotationsByStatus: quotationsByStatus.reduce((acc, curr) => ({
        ...acc,
        [curr.status]: curr._count
      }), {}),
      recentQuotations,
      lowStockProducts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
