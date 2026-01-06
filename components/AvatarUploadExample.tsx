'use client'

/**
 * Example usage of AvatarUpload component
 * 
 * This is just an example - integrate this into your profile/settings page
 */

import AvatarUpload from './AvatarUpload'
import { useState } from 'react'

export default function AvatarUploadExample() {
  const [userId] = useState('your-user-id-here') // Replace with actual user ID from session/auth
  const [currentAvatar, setCurrentAvatar] = useState('')

  const handleUploadSuccess = (avatarUrl: string) => {
    setCurrentAvatar(avatarUrl)
    console.log('Avatar uploaded successfully:', avatarUrl)
    // You can update your user state or make an API call here
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Update Profile Photo</h2>
      <AvatarUpload
        userId={userId}
        currentAvatar={currentAvatar}
        onUploadSuccess={handleUploadSuccess}
        size={150}
      />
    </div>
  )
}



