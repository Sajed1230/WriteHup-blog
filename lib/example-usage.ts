/**
 * Example: How to use MongoDB connection in your API routes or server components
 * 
 * In API Routes (app/api/example/route.ts):
 * 
 * import connectDB from '@/lib/mongodb'
 * import { NextResponse } from 'next/server'
 * 
 * export async function GET() {
 *   try {
 *     await connectDB()
 *     // Your database operations here
 *     return NextResponse.json({ message: 'Connected to MongoDB' })
 *   } catch (error) {
 *     return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
 *   }
 * }
 * 
 * 
 * In Server Components or Server Actions:
 * 
 * import connectDB from '@/lib/mongodb'
 * 
 * export default async function MyComponent() {
 *   await connectDB()
 *   // Your database operations here
 *   return <div>Connected to MongoDB</div>
 * }
 */




