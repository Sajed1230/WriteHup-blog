'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface MediaFile {
  file: File
  preview: string
  type: 'image' | 'video'
}

export default function NewPostPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loadingData, setLoadingData] = useState(true)
  
  const [featuredMedia, setFeaturedMedia] = useState<File | null>(null)
  const [featuredMediaPreview, setFeaturedMediaPreview] = useState('')
  const [featuredMediaType, setFeaturedMediaType] = useState<'image' | 'video' | null>(null)
  
  const [additionalFiles, setAdditionalFiles] = useState<MediaFile[]>([])

  useEffect(() => {
    fetchCategoriesAndTags()
  }, [])

  const fetchCategoriesAndTags = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/tags'),
      ])

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])
      }

      if (tagsRes.ok) {
        const tagsData = await tagsRes.json()
        setTags(tagsData.tags || [])
      }
    } catch (error) {
      console.error('Error fetching categories and tags:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setFeaturedMedia(file)
        setFeaturedMediaType('image')
        const reader = new FileReader()
        reader.onloadend = () => {
          setFeaturedMediaPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src)
          const duration = video.duration
          if (duration > 60) {
            setError('Video must be 1 minute or less. Please select a shorter video.')
            e.target.value = ''
            setFeaturedMedia(null)
            setFeaturedMediaPreview('')
            setFeaturedMediaType(null)
            return
          }
          setFeaturedMedia(file)
          setFeaturedMediaType('video')
          const reader = new FileReader()
          reader.onloadend = () => {
            setFeaturedMediaPreview(reader.result as string)
          }
          reader.readAsDataURL(file)
        }
        video.src = URL.createObjectURL(file)
      }
    }
  }

  const handleAdditionalFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setAdditionalFiles(prev => [...prev, {
            file,
            preview: reader.result as string,
            type: 'image',
          }])
        }
        reader.readAsDataURL(file)
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src)
          const duration = video.duration
          if (duration > 60) {
            setError(`Video "${file.name}" must be 1 minute or less. Skipping...`)
            return
          }
          const reader = new FileReader()
          reader.onloadend = () => {
            setAdditionalFiles(prev => [...prev, {
              file,
              preview: reader.result as string,
              type: 'video',
            }])
          }
          reader.readAsDataURL(file)
        }
        video.src = URL.createObjectURL(file)
      }
    })
    
    // Reset input
    e.target.value = ''
  }

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index))
  }

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    )
  }

  const addNewTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('content', content.trim())
      formData.append('excerpt', excerpt.trim())
      formData.append('status', status)
      
      // Use selected category or new category
      const categoryToUse = selectedCategory || newCategory.trim()
      if (categoryToUse) {
        formData.append('category', categoryToUse)
      }
      
      // Combine selected tags and new tags
      const allTags = [...selectedTags]
      if (newTag.trim() && !allTags.includes(newTag.trim())) {
        allTags.push(newTag.trim())
      }
      if (allTags.length > 0) {
        formData.append('tags', allTags.join(','))
      }
      
      if (featuredMedia) {
        formData.append('featuredMedia', featuredMedia)
        formData.append('featuredMediaType', featuredMediaType || 'image')
      }

      // Add additional files
      additionalFiles.forEach((mediaFile, index) => {
        formData.append(`additionalFiles`, mediaFile.file)
        formData.append(`additionalFileTypes`, mediaFile.type)
      })

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create post')
        setIsLoading(false)
        return
      }

      // Success - redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Create post error:', error)
      setError(error.message || 'Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  if (!user || (user.role !== 'author' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">Only authors and admins can create posts.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-blue-400/20 rounded-full blur-3xl -z-0"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Create New Post
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Share your thoughts and ideas with the world</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={200}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Enter post title..."
                />
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-2">
                  Excerpt (Optional)
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  maxLength={300}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Brief description of your post..."
                />
                <p className="text-xs text-gray-500 mt-1">{excerpt.length}/300 characters</p>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={15}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-sm bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Write your post content here... (Markdown supported)"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category (Optional)
                </label>
                <div className="space-y-3">
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                  >
                    <option value="">Select a category...</option>
                    {loadingData ? (
                      <option>Loading categories...</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Or create new category..."
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                    />
                    {newCategory.trim() && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(newCategory.trim())
                          setNewCategory('')
                        }}
                        className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <div className="space-y-3">
                  {/* Selected Tags */}
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                      {selectedTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          {tag}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Available Tags */}
                  {!loadingData && tags.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Available Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.name)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              selectedTags.includes(tag.name)
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Tag */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addNewTag()
                        }
                      }}
                      placeholder="Add new tag..."
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                    />
                    {newTag.trim() && (
                      <button
                        type="button"
                        onClick={addNewTag}
                        className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Add Tag
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Featured Media */}
              <div>
                <label htmlFor="featuredMedia" className="block text-sm font-semibold text-gray-700 mb-2">
                  Featured Media (Optional - Image or Video)
                </label>
                <div className="space-y-4">
                  {featuredMediaPreview && (
                    <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                      {featuredMediaType === 'image' ? (
                        <img
                          src={featuredMediaPreview}
                          alt="Featured media preview"
                          className="w-full h-full object-cover"
                        />
                      ) : featuredMediaType === 'video' ? (
                        <video
                          src={featuredMediaPreview}
                          controls
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setFeaturedMedia(null)
                          setFeaturedMediaPreview('')
                          setFeaturedMediaType(null)
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <input
                    id="featuredMedia"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                  />
                  <p className="text-xs text-gray-500">Accepted formats: Images (JPEG, PNG, WebP) or Videos (MP4, WebM, Ogg). Videos must be 1 minute or less.</p>
                </div>
              </div>

              {/* Additional Files */}
              <div>
                <label htmlFor="additionalFiles" className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Media Files (Optional - Images or Videos)
                </label>
                <div className="space-y-4">
                  {additionalFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                      {additionalFiles.map((mediaFile, index) => (
                        <div key={index} className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                          {mediaFile.type === 'image' ? (
                            <img
                              src={mediaFile.preview}
                              alt={`Additional file ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <video
                              src={mediaFile.preview}
                              className="w-full h-32 object-cover"
                              muted
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeAdditionalFile(index)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                            {mediaFile.type === 'image' ? 'Image' : 'Video'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    id="additionalFiles"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleAdditionalFilesChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                  />
                  <p className="text-xs text-gray-500">You can select multiple files. Videos must be 1 minute or less.</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Creating...' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
