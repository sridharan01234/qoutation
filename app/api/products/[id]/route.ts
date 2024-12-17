// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

interface Params {
  params: {
    id: string
  }
}

// GET single product
export async function GET(request: Request, { params }: Params) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id
      },
      include: {
        category: true,
        tags: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// PATCH update product
export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      categoryId,
      price,
      stock,
      sku,
      image,
      status,
      featured,
      weight,
      dimensions,
      tags
    } = body

    const product = await prisma.product.update({
      where: {
        id: params.id
      },
      data: {
        name,
        description,
        categoryId,
        price: price ? parseFloat(price) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        sku,
        image,
        status,
        featured,
        weight: weight ? parseFloat(weight) : null,
        dimensions,
        tags: tags ? {
          set: [],
          connect: tags.map((tagId: string) => ({ id: tagId }))
        } : undefined
      },
      include: {
        category: true,
        tags: true
      }
    })

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// DELETE product
export async function DELETE(request: Request, { params }: Params) {
  try {
    await prisma.product.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
