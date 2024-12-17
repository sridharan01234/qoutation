
// app/api/quotations/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'

// GET single quotation
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          include: {
            address: true
          }
        },
        items: {
          include: {
            product: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        attachments: true,
        activities: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 'success', data: quotation });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotation' },
      { status: 500 }
    );
  }
}

// PUT update quotation
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Calculate new totals
    const subtotal = body.items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const taxAmount = subtotal * (body.taxRate / 100);
    const totalAmount = subtotal + taxAmount - body.discount + body.shippingCost;

    // Update quotation
    const quotation = await prisma.$transaction(async (prisma) => {
      // Delete existing items
      await prisma.quotationItem.deleteMany({
        where: { quotationId: params.id }
      });

      // Update quotation with new items
      return prisma.quotation.update({
        where: { id: params.id },
        data: {
          validUntil: new Date(body.validUntil),
          status: body.status,
          subtotal,
          taxRate: body.taxRate || 0,
          taxAmount,
          discount: body.discount || 0,
          shippingCost: body.shippingCost || 0,
          totalAmount,
          notes: body.notes,
          terms: body.terms,
          paymentTerms: body.paymentTerms,
          shippingMethod: body.shippingMethod,
          revisionNumber: {
            increment: 1
          },
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
              type: 'UPDATED',
              description: 'Quotation updated',
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
    });

    return NextResponse.json({ status: 'success', data: quotation });
  } catch (error) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to update quotation' },
      { status: 500 }
    );
  }
}

// DELETE quotation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.quotation.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return NextResponse.json(
      { error: 'Failed to delete quotation' },
      { status: 500 }
    );
  }
}

// app/api/quotations/[id]/status/route.ts
// Update quotation status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const quotation = await prisma.quotation.update({
      where: { id: params.id },
      data: {
        status,
        activities: {
          create: {
            type: 'STATUS_CHANGED',
            description: `Status changed to ${status}`,
            userId: session.user.id
          }
        }
      },
      include: {
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    return NextResponse.json({ status: 'success', data: quotation });
  } catch (error) {
    console.error('Error updating quotation status:', error);
    return NextResponse.json(
      { error: 'Failed to update quotation status' },
      { status: 500 }
    );
  }
}
