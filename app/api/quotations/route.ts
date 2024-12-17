// app/api/quotations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause
    const where: any = {};

    // Add search condition
    if (search) {
      where.OR = [
        { quotationNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { company: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Add status filter
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Add date range filter
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(`${startDate}T00:00:00Z`),
        lte: new Date(`${endDate}T23:59:59Z`)
      };
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await prisma.quotation.count({
      where
    });

    // Fetch quotations with relations
    const quotations = await prisma.quotation.findMany({
      where,
      include: {
        customer: {
          select: {
            name: true,
            company: true,
            email: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      quotations,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    });

  } catch (error) {
    console.error('Error in quotations API:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}


// POST create new quotation
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Generate quotation number
    const year = new Date().getFullYear();
    const quotationCount = await prisma.quotation.count({
      where: {
        quotationNumber: {
          startsWith: `QT-${year}`
        }
      }
    });
    const quotationNumber = `QT-${year}-${String(quotationCount + 1).padStart(3, '0')}`;

    // Calculate totals
    const subtotal = body.items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const taxAmount = subtotal * (body.taxRate / 100);
    const totalAmount = subtotal + taxAmount - body.discount + body.shippingCost;

    // Create quotation with all relations
    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        customerId: body.customerId,
        assignedToId: session.user.id,
        validUntil: new Date(body.validUntil),
        status: body.status || 'DRAFT',
        subtotal,
        taxRate: body.taxRate || 0,
        taxAmount,
        discount: body.discount || 0,
        shippingCost: body.shippingCost || 0,
        totalAmount,
        notes: body.notes,
        terms: body.terms,
        currency: body.currency || 'USD',
        paymentTerms: body.paymentTerms,
        shippingMethod: body.shippingMethod,
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            tax: item.tax || 0,
            total: item.quantity * item.unitPrice,
            notes: item.notes
          }))
        },
        activities: {
          create: {
            type: 'CREATED',
            description: 'Quotation created',
            userId: session.user.id
          }
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        },
        activities: true
      }
    });

    return NextResponse.json({ status: 'success', data: quotation });
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}
