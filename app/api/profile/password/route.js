// app/api/profile/password/route.js
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true }
    })

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
