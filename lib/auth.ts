import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error(
    'Please define the JWT_SECRET environment variable inside .env.local'
  )
}

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

/**
 * Generate JWT token for user
 */
export function generateToken(payload: TokenPayload): string {
  // JWT_SECRET is guaranteed to be defined due to the check above
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: '7d', // Token expires in 7 days
  })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    // JWT_SECRET is guaranteed to be defined due to the check above
    return jwt.verify(token, JWT_SECRET as string) as TokenPayload
  } catch (error) {
    return null
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}



