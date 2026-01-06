import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function GET() {
  try {
    // Test Cloudinary configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cloudinary credentials not configured',
          configured: {
            cloudName: !!cloudName,
            apiKey: !!apiKey,
            apiSecret: !!apiSecret,
          },
        },
        { status: 500 }
      )
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })

    // Test connection by pinging Cloudinary
    const result = await cloudinary.api.ping()

    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful!',
      cloudName: cloudName,
      status: result.status,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Cloudinary connection failed',
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

