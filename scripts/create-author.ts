import mongoose from 'mongoose'
import connectDB from '../lib/mongodb'
import User from '../schemas/User'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define first the MONGODB_URI environment variable')
}

async function createAuthor() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

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
      console.log('Author already exists!')
      console.log('Email:', authorData.email)
      console.log('Password:', authorData.password)
      console.log('Role:', existingUser.role)
      process.exit(0)
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(authorData.password, salt)

    // Create author user
    const author = new User({
      name: authorData.name,
      email: authorData.email,
      password: hashedPassword,
      role: authorData.role,
    })

    await author.save()

    console.log('\n✅ Author created successfully!')
    console.log('\n📧 Login Information:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:    ', authorData.email)
    console.log('Password: ', authorData.password)
    console.log('Role:     ', authorData.role)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    process.exit(0)
  } catch (error: any) {
    console.error('Error creating author:', error)
    process.exit(1)
  }
}

createAuthor()

