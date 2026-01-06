import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/schemas/User'
import { hashPassword, generateToken } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const avatarFile = formData.get('avatar') as File | null

    // Debug: Log all form data keys
    console.log('FormData keys:', Array.from(formData.keys()))
    console.log('Avatar file received:', avatarFile ? {
      name: avatarFile.name,
      type: avatarFile.type,
      size: avatarFile.size,
    } : 'null')

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Upload avatar if provided
    let avatarUrl = ''
    if (avatarFile && avatarFile.size > 0) {
      try {
        console.log('Avatar file received:', {
          name: avatarFile.name,
          type: avatarFile.type,
          size: avatarFile.size,
        })

        const bytes = await avatarFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Validate file type
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!validImageTypes.includes(avatarFile.type)) {
          console.error('Invalid image type:', avatarFile.type)
          return NextResponse.json(
            { error: 'Invalid image type. Allowed: JPEG, PNG, WebP' },
            { status: 400 }
          )
        }

        // Validate file size (max 5MB)
        if (buffer.length > 5 * 1024 * 1024) {
          console.error('File too large:', buffer.length)
          return NextResponse.json(
            { error: 'Avatar size must be less than 5MB' },
            { status: 400 }
          )
        }

        console.log('Uploading avatar to Cloudinary...')
        // Upload to Cloudinary
        const result = await uploadImage(buffer, 'writehup/avatars', {
          width: 400,
          height: 400,
          quality: 80, // Use numeric quality instead of 'auto'
          crop: 'fill',
          gravity: 'face',
        })
        
        avatarUrl = result.url
        console.log('Avatar uploaded successfully:', avatarUrl)
      } catch (error: any) {
        console.error('Avatar upload error:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
        })
        // Continue without avatar if upload fails, but log the error
        // Don't fail the entire signup if avatar upload fails
      }
    } else {
      console.log('No avatar file provided or file is empty')
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: avatarUrl || '', // Ensure it's always a string
      role: 'reader', // Default role
    })

    console.log('Creating user with avatar URL:', avatarUrl || 'empty')
    await user.save()
    console.log('User created successfully with avatar:', user.avatar)

    // Generate JWT token for automatic login
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Return user data (without password)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    }

    // Create response with token in cookie (auto-login)
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: userData,
        token,
      },
      { status: 201 }
    )

    // Set HTTP-only cookie for token (auto-login after signup)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    )
  }
}

