// app/api/tags/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.productTag.findMany();
    return NextResponse.json(tags);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
