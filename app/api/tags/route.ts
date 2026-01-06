import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Tag from '@/schemas/Tag'

// Get all tags
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const tags = await Tag.find({})
      .sort({ name: 1 }) // Sort alphabetically

    return NextResponse.json({
      success: true,
      tags: tags.map(tag => ({
        id: tag._id.toString(),
        name: tag.name,
        slug: tag.slug,
      })),
    })
  } catch (error: any) {
    console.error('Get tags error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get tags' },
      { status: 500 }
    )
  }
}



