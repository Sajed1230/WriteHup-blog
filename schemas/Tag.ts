import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITag extends Document {
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

const TagSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
      trim: true,
      maxlength: [30, 'Tag name cannot exceed 30 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
// Note: slug and name indexes are automatically created by unique: true
// Additional indexes can be added here if needed for non-unique fields

const Tag: Model<ITag> = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema)

export default Tag

