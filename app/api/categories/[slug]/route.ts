import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/schemas/Category'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    await connectDB()

    const resolvedParams = 'then' in params ? await params : params
    const category = await Category.findOne({ slug: resolvedParams.slug })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      category: {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description || `${category.name} posts and articles`,
      },
    })
  } catch (error: any) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get category' },
      { status: 500 }
    )
  }
}

