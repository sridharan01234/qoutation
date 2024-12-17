// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')

    const whereClause: any = {}

    if (category) {
      whereClause.categoryId = category
    }
    if (status) {
      whereClause.status = status
    }
    if (featured) {
      whereClause.featured = featured === 'true'
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
        price: true,
        stock: true,
        sku: true,
        image: true,
        status: true,
        weight: true,
        dimensions: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ data: products })

  } catch (error) {
    console.error('Detailed error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        categoryId: body.categoryId,
        price: parseFloat(body.price),
        stock: parseInt(body.stock),
        sku: body.sku,
        image: body.image,
        status: body.status || 'IN_STOCK',
        weight: body.weight ? parseFloat(body.weight) : null,
        dimensions: body.dimensions || null,
        tags: {
          connect: body.tags?.map((tagId: string) => ({ id: tagId })) || []
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
        price: true,
        stock: true,
        sku: true,
        image: true,
        status: true,
        weight: true,
        dimensions: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(
      { data: product },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
