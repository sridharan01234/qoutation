// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    // Test database connection first
    await prisma.$connect();
    console.log('Database connection successful');

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
      prisma.product.count().catch(e => {
        console.error('Error counting products:', e);
        return 0;
      }),
      
      prisma.customer.count().catch(e => {
        console.error('Error counting customers:', e);
        return 0;
      }),
      
      prisma.quotation.count().catch(e => {
        console.error('Error counting quotations:', e);
        return 0;
      }),
      
      prisma.customer.count({
        where: { isActive: true }
      }).catch(e => {
        console.error('Error counting active customers:', e);
        return 0;
      }),
      
      prisma.product.groupBy({
        by: ['status'],
        _count: true
      }).catch(e => {
        console.error('Error grouping products by status:', e);
        return [];
      }),
      
      prisma.quotation.groupBy({
        by: ['status'],
        _count: true
      }).catch(e => {
        console.error('Error grouping quotations by status:', e);
        return [];
      }),
      
      prisma.quotation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { name: true }
          }
        }
      }).catch(e => {
        console.error('Error fetching recent quotations:', e);
        return [];
      }),
      
      prisma.product.findMany({
        where: { status: 'LOW_STOCK' },
        take: 5,
        orderBy: { stock: 'asc' }
      }).catch(e => {
        console.error('Error fetching low stock products:', e);
        return [];
      })
    ]);

    // Calculate total revenue
    const revenue = await prisma.quotation.aggregate({
      where: { status: 'APPROVED' },
      _sum: { totalAmount: true }
    }).catch(e => {
      console.error('Error calculating revenue:', e);
      return { _sum: { totalAmount: null } };
    });

    await prisma.$disconnect();

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
    console.error('Detailed error in dashboard stats:', error);
    
    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('Database connection failed:', error.message);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma known error:', error.message, 'Code:', error.code);
      return NextResponse.json(
        { error: `Database error: ${error.code}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
