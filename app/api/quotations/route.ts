// app/api/quotations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};

    if (search) {
      where.OR = [
        { quotationNumber: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { company: { contains: search } } }
      ];
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(`${startDate}T00:00:00Z`),
        lte: new Date(`${endDate}T23:59:59Z`)
      };
    }

    const skip = (page - 1) * limit;

    const [total, quotations] = await Promise.all([
      prisma.quotation.count({ where }),
      prisma.quotation.findMany({
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
      })
    ]);

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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.customerId || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0);

    const taxRate = Number(body.taxRate) || 0;
    const discount = Number(body.discount) || 0;
    const shippingCost = Number(body.shippingCost) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount - discount + shippingCost;

    // Create quotation
    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        customerId: body.customerId,
        userId: session.user.id,
        date: new Date(),
        validUntil: body.validUntil ? new Date(body.validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'DRAFT',
        subtotal,
        taxRate,
        taxAmount,
        discount,
        discountType: body.discountType || 'FIXED',
        shippingCost,
        totalAmount,
        notes: body.notes || '',
        terms: body.terms || '',
        paymentTerms: body.paymentTerms || 'IMMEDIATE',
        currency: body.currency || 'USD',
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            discount: Number(item.discount) || 0,
            tax: Number(item.tax) || 0,
            total: (Number(item.quantity) * Number(item.unitPrice)) * (1 - (Number(item.discount) || 0) / 100),
            notes: item.notes || ''
          }))
        },
        activities: {
          create: {
            userId: session.user.id,
            type: 'CREATED',
            description: 'Quotation created'
          }
        }
      },
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
      }
    });

    return NextResponse.json(quotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}
