import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/schemas/Category'

// Get all categories
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const categories = await Category.find({})
      .sort({ name: 1 }) // Sort alphabetically

    return NextResponse.json({
      success: true,
      categories: categories.map(cat => ({
        id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
      })),
    })
  } catch (error: any) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get categories' },
      { status: 500 }
    )
  }
}



