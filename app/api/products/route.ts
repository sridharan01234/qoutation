// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    const whereClause: any = {};

    if (category) {
      whereClause.categoryId = category;
    }
    if (status) {
      whereClause.status = status;
    }
    if (featured) {
      whereClause.featured = featured === "true";
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
            name: true,
          },
        },
        productTags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
            assignedAt: true,
          },
        },
      },
    });

    // Return the response with proper structure
    return NextResponse.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}
