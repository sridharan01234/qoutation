// app/api/profile/avatar/route.js
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const filename = `${session.user.id}-${uuidv4()}`
    
    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `avatars/${filename}`,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      })
    )

    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/avatars/${filename}`

    // Update user's avatar in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl }
    })

    return NextResponse.json({ 
      message: "Avatar updated successfully",
      imageUrl 
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 })
  }
}
