// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { Role } from '@prisma/client'

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = await context.params.id

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const data = await request.json()
    
    if (!data) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      )
    }

    // Only allow updating permitted fields
    const cleanData = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.role !== undefined && { role: data.role as Role }),
      ...(data.isActive !== undefined && { isActive: data.isActive })
    }

    console.log('Updating user:', { id, data: cleanData })

    const updatedUser = await prisma.user.update({
      where: {
        id: id
      },
      data: cleanData,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
        // Excluding password for security
        // Excluding accounts and sessions as they're relations
      }
    })

    return NextResponse.json({ 
      success: true,
      user: updatedUser 
    })

  } catch (error) {
    console.error('Error updating user:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to update user',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
