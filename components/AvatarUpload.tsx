'use client'

import { useState, useRef } from 'react'
import { uploadAvatar, validateAvatarFile, getOptimizedAvatarUrl } from '@/lib/avatarUtils'

interface AvatarUploadProps {
  userId: string
  currentAvatar?: string
  onUploadSuccess?: (avatarUrl: string) => void
  size?: number
  className?: string
}

export default function AvatarUpload({
  userId,
  currentAvatar,
  onUploadSuccess,
  size = 200,
  className = '',
}: AvatarUploadProps) {
  const [avatar, setAvatar] = useState(currentAvatar || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    // Validate file
    const validation = validateAvatarFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const result = await uploadAvatar(file, userId)
      const optimizedUrl = getOptimizedAvatarUrl(result.avatar, size)
      setAvatar(optimizedUrl)
      setPreview(null)
      onUploadSuccess?.(result.avatar)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      setPreview(null)
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Avatar Display */}
      <div className="relative group">
        <div
          className={`relative rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer transition-all duration-200 ${
            uploading ? 'opacity-50' : 'hover:scale-105'
          }`}
          style={{ width: size, height: size }}
          onClick={handleClick}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : avatar ? (
            <img
              src={getOptimizedAvatarUrl(avatar, size)}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {getInitials('User')}
            </div>
          )}

          {/* Upload Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white text-center">
              <svg
                className="w-8 h-8 mx-auto mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs font-medium">Change Photo</p>
            </div>
          </div>

          {/* Uploading Indicator */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}

      {/* Upload Hint */}
      <p className="mt-2 text-xs text-gray-500 text-center max-w-xs">
        Click to upload. Max 5MB. JPEG, PNG, or WebP.
      </p>
    </div>
  )
}



