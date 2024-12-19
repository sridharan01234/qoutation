import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { ProductStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;

    // Filter parameters
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const order = searchParams.get("order")?.toLowerCase() === "asc" ? "asc" : "desc";

    // Input validation
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Type-safe where clause
    const whereClause: {
      categoryId?: string;
      status?: ProductStatus;
      featured?: boolean;
    } = {};

    if (category) {
      whereClause.categoryId = category;
    }
    if (status && Object.values(ProductStatus).includes(status as ProductStatus)) {
      whereClause.status = status as ProductStatus;
    }
    if (featured !== null) {
      whereClause.featured = featured === "true";
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where: whereClause });

    // Get products with pagination and sorting
    const products = await prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        productTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Transform the response to match the expected format
    const transformedProducts = products.map(product => ({
      ...product,
      productTags: product.productTags.map(pt => ({
        tag: pt.tag,
        assignedAt: pt.assignedAt
      }))
    }));

    // Return the response with pagination metadata
    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + products.length < total,
      },
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}
