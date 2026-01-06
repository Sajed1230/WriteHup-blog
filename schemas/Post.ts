import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IMedia {
  url: string
  alt?: string
  caption?: string
}

export interface IVideo {
  url: string
  thumbnail?: string
  title?: string
  duration?: number // in seconds
}

export interface IPost extends Document {
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  images: IMedia[]
  videos: IVideo[]
  author: mongoose.Types.ObjectId
  category?: mongoose.Types.ObjectId
  tags: mongoose.Types.ObjectId[]
  status: 'draft' | 'published' | 'archived'
  views: number
  likes: number
  comments?: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
      default: '',
    },
    featuredImage: {
      type: String,
      default: '',
    },
    images: [
      {
        url: {
          type: String,
          required: [true, 'Image URL is required'],
        },
        alt: {
          type: String,
          default: '',
        },
        caption: {
          type: String,
          maxlength: [200, 'Caption cannot exceed 200 characters'],
          default: '',
        },
      },
    ],
    videos: [
      {
        url: {
          type: String,
          required: [true, 'Video URL is required'],
        },
        thumbnail: {
          type: String,
          default: '',
        },
        title: {
          type: String,
          maxlength: [200, 'Video title cannot exceed 200 characters'],
          default: '',
        },
        duration: {
          type: Number,
          default: 0, // Duration in seconds
        },
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Indexes for faster queries
// Note: slug index is automatically created by unique: true
PostSchema.index({ author: 1 })
PostSchema.index({ category: 1 })
PostSchema.index({ tags: 1 })
PostSchema.index({ status: 1 })
PostSchema.index({ createdAt: -1 }) // For sorting by newest
PostSchema.index({ views: -1 }) // For sorting by popularity

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post

