import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB()
    
    // Get connection state
    const connectionState = mongoose.connection.readyState
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
    
    // Get database info
    const dbName = mongoose.connection.db?.databaseName
    const host = mongoose.connection.host
    const port = mongoose.connection.port
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!',
      connection: {
        state: states[connectionState as keyof typeof states] || 'unknown',
        stateCode: connectionState,
        database: dbName,
        host: host,
        port: port,
      },
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connection failed',
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}




