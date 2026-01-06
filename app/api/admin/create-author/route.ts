import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/schemas/User'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Author credentials
    const authorData = {
      name: 'WriteHup Author',
      email: 'author@writehup.com',
      password: 'Author123!',
      role: 'author' as const,
    }

    // Check if author already exists
    const existingUser = await User.findOne({ email: authorData.email })
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Author already exists!',
        credentials: {
          email: authorData.email,
          password: authorData.password,
          role: existingUser.role,
        },
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(authorData.password)

    // Create author user
    const author = new User({
      name: authorData.name,
      email: authorData.email,
      password: hashedPassword,
      role: authorData.role,
    })

    await author.save()

    return NextResponse.json({
      success: true,
      message: 'Author created successfully!',
      credentials: {
        email: authorData.email,
        password: authorData.password,
        role: authorData.role,
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating author:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create author' },
      { status: 500 }
    )
  }
}



