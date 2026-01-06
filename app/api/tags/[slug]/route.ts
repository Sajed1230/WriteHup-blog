import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Tag from '@/schemas/Tag'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    await connectDB()

    const resolvedParams = 'then' in params ? await params : params
    const tag = await Tag.findOne({ slug: resolvedParams.slug })

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      tag: {
        id: tag._id.toString(),
        name: tag.name,
        slug: tag.slug,
      },
    })
  } catch (error: any) {
    console.error('Get tag error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get tag' },
      { status: 500 }
    )
  }
}



