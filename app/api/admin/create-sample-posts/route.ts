import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/schemas/Post'
import User from '@/schemas/User'
import Category from '@/schemas/Category'
import Tag from '@/schemas/Tag'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Find the author user
    const author = await User.findOne({ role: 'author' })
    if (!author) {
      return NextResponse.json(
        { error: 'No author found. Please create an author account first.' },
        { status: 404 }
      )
    }

    // Sample posts data
    const samplePosts = [
      {
        title: 'Getting Started with Next.js 14',
        content: `# Getting Started with Next.js 14

Next.js 14 brings exciting new features and improvements to the React framework. In this comprehensive guide, we'll explore the latest updates and how to leverage them in your projects.

## What's New in Next.js 14

### Server Components by Default
Next.js 14 makes Server Components the default, providing better performance and SEO out of the box.

### Improved Developer Experience
- Faster refresh times
- Better error messages
- Enhanced TypeScript support

### Performance Improvements
- Reduced bundle sizes
- Faster page loads
- Better caching strategies

## Getting Started

To create a new Next.js 14 project, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

Choose your preferred options and you're ready to go!

## Conclusion

Next.js 14 is a powerful framework that makes building React applications easier and more efficient. Start exploring today!`,
        excerpt: 'Learn about the latest features in Next.js 14 and how to get started with this powerful React framework.',
        category: 'Tech',
        tags: ['Next.js', 'React', 'Web Development', 'JavaScript'],
        status: 'published' as const,
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
            alt: 'Next.js development environment',
            caption: 'Modern development setup with Next.js',
          },
          {
            url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
            alt: 'Code editor with React',
            caption: 'Writing React components',
          },
        ],
        videos: [],
      },
      {
        title: 'Modern UI Design Principles',
        content: `# Modern UI Design Principles

Design is not just about making things look pretty. It's about creating experiences that users love and remember.

## Key Principles

### 1. Simplicity
Less is more. Clean, uncluttered interfaces are easier to understand and use.

### 2. Consistency
Maintain consistent patterns throughout your application. Users should feel familiar with your interface.

### 3. Feedback
Always provide feedback to user actions. Let them know what's happening.

### 4. Accessibility
Design for everyone. Make sure your interfaces are accessible to all users.

## Color Theory

Understanding color theory is crucial for creating visually appealing designs. Use color to guide user attention and convey meaning.

## Typography

Good typography improves readability and sets the tone of your design. Choose fonts that match your brand and are easy to read.

## Conclusion

Great design is invisible. When done right, users don't notice the design - they just enjoy the experience.`,
        excerpt: 'Explore the fundamental principles of modern UI design and learn how to create beautiful, user-friendly interfaces.',
        category: 'Design',
        tags: ['UI Design', 'UX', 'Design Principles', 'Web Design'],
        status: 'published' as const,
        featuredImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
            alt: 'UI Design examples',
            caption: 'Beautiful interface designs',
          },
        ],
        videos: [
          {
            url: 'https://res.cloudinary.com/dhxvbeuah/video/upload/v1/writehup/videos/sample-video-1min.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
            title: 'UI Design Tutorial',
            duration: 45,
          },
        ],
      },
      {
        title: 'Mastering Python for Data Science',
        content: `# Mastering Python for Data Science

Python has become the go-to language for data science and machine learning. Let's explore why and how to get started.

## Why Python?

Python's simplicity and powerful libraries make it perfect for data science:
- Easy to learn syntax
- Rich ecosystem of libraries
- Strong community support
- Excellent documentation

## Essential Libraries

### NumPy
For numerical computing and array operations.

### Pandas
For data manipulation and analysis.

### Matplotlib
For data visualization.

### Scikit-learn
For machine learning algorithms.

## Getting Started

Install the essential libraries:

\`\`\`bash
pip install numpy pandas matplotlib scikit-learn
\`\`\`

## Example: Loading Data

\`\`\`python
import pandas as pd

# Load CSV file
df = pd.read_csv('data.csv')

# Display first few rows
print(df.head())
\`\`\`

## Conclusion

Python is an excellent choice for data science. Start with the basics and gradually explore more advanced topics.`,
        excerpt: 'Discover why Python is the preferred language for data science and learn the essential libraries you need to know.',
        category: 'Programming',
        tags: ['Python', 'Data Science', 'Machine Learning', 'Programming'],
        status: 'published' as const,
        featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
            alt: 'Python code',
            caption: 'Python programming',
          },
          {
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
            alt: 'Data visualization',
            caption: 'Data analysis with Python',
          },
        ],
        videos: [],
      },
      {
        title: 'The Future of Artificial Intelligence',
        content: `# The Future of Artificial Intelligence

Artificial Intelligence is transforming the world as we know it. Let's explore what the future holds.

## Current State of AI

AI has made remarkable progress in recent years:
- Natural language processing
- Computer vision
- Autonomous systems
- Predictive analytics

## Emerging Trends

### Large Language Models
Models like GPT-4 are revolutionizing how we interact with computers.

### AI in Healthcare
AI is helping doctors diagnose diseases and develop treatments.

### Autonomous Vehicles
Self-driving cars are becoming a reality.

## Ethical Considerations

As AI becomes more powerful, we must consider:
- Privacy concerns
- Job displacement
- Bias in algorithms
- Regulation needs

## The Road Ahead

The future of AI is bright, but we must navigate it carefully. Collaboration between technologists, ethicists, and policymakers is essential.

## Conclusion

AI will continue to evolve and impact every aspect of our lives. Understanding its potential and limitations is crucial for everyone.`,
        excerpt: 'Explore the current state and future possibilities of artificial intelligence and its impact on society.',
        category: 'AI',
        tags: ['AI', 'Machine Learning', 'Technology', 'Future'],
        status: 'published' as const,
        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
        images: [],
        videos: [
          {
            url: 'https://res.cloudinary.com/dhxvbeuah/video/upload/v1/writehup/videos/ai-future-demo.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            title: 'AI Future Overview',
            duration: 55,
          },
        ],
      },
      {
        title: 'Building a Successful Startup',
        content: `# Building a Successful Startup

Starting a business is challenging, but with the right approach, you can build something amazing.

## Key Steps

### 1. Find a Problem
Solve a real problem that people have. Don't create solutions looking for problems.

### 2. Validate Your Idea
Talk to potential customers before building. Make sure there's demand.

### 3. Build an MVP
Create a Minimum Viable Product. Launch quickly and iterate based on feedback.

### 4. Focus on Customers
Your customers are your most valuable asset. Listen to them and serve them well.

## Common Mistakes

- Trying to do everything at once
- Ignoring customer feedback
- Running out of cash
- Hiring too quickly

## Success Factors

- Clear vision
- Strong team
- Customer focus
- Adaptability
- Persistence

## Conclusion

Building a startup is a journey. Stay focused, learn from mistakes, and keep moving forward.`,
        excerpt: 'Learn the essential steps and common pitfalls when building a startup from scratch.',
        category: 'Business',
        tags: ['Startup', 'Entrepreneurship', 'Business', 'Success'],
        status: 'published' as const,
        featuredImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
            alt: 'Startup team',
            caption: 'Building a successful team',
          },
          {
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
            alt: 'Business growth',
            caption: 'Scaling your business',
          },
        ],
        videos: [],
      },
      {
        title: 'Productivity Hacks for Developers',
        content: `# Productivity Hacks for Developers

Being productive as a developer is about working smarter, not harder. Here are some proven strategies.

## Time Management

### Pomodoro Technique
Work in focused 25-minute intervals with 5-minute breaks.

### Time Blocking
Schedule specific blocks of time for different tasks.

### Eliminate Distractions
Turn off notifications and focus on one task at a time.

## Tools and Automation

### Use Version Control
Git helps you track changes and collaborate effectively.

### Automate Repetitive Tasks
Write scripts to automate boring, repetitive work.

### Use IDE Shortcuts
Learn keyboard shortcuts to work faster.

## Code Quality

### Write Clean Code
Clean code is easier to read, maintain, and debug.

### Code Reviews
Regular code reviews improve quality and knowledge sharing.

### Documentation
Good documentation saves time in the long run.

## Health and Wellbeing

- Take regular breaks
- Stay hydrated
- Exercise regularly
- Get enough sleep

## Conclusion

Productivity is a skill that can be learned and improved. Start with small changes and build better habits over time.`,
        excerpt: 'Discover practical productivity tips and techniques to help you work more efficiently as a developer.',
        category: 'Productivity',
        tags: ['Productivity', 'Development', 'Tips', 'Workflow'],
        status: 'published' as const,
        featuredImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
            alt: 'Productive workspace',
            caption: 'Organized workspace for better productivity',
          },
        ],
        videos: [
          {
            url: 'https://res.cloudinary.com/dhxvbeuah/video/upload/v1/writehup/videos/productivity-tips.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
            title: 'Productivity Tips for Developers',
            duration: 50,
          },
        ],
      },
    ]

    const createdPosts = []

    for (const postData of samplePosts) {
      // Generate slug
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Check if post already exists
      const existingPost = await Post.findOne({ slug })
      if (existingPost) {
        console.log(`Post "${postData.title}" already exists, skipping...`)
        continue
      }

      // Handle category
      let category = await Category.findOne({ name: postData.category })
      if (!category) {
        const categorySlug = postData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        category = new Category({
          name: postData.category,
          slug: categorySlug,
        })
        await category.save()
      }

      // Handle tags
      const tagIds: any[] = []
      for (const tagName of postData.tags) {
        let tag = await Tag.findOne({ name: tagName })
        if (!tag) {
          const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          tag = new Tag({
            name: tagName,
            slug: tagSlug,
          })
          await tag.save()
        }
        tagIds.push(tag._id)
      }

      // Create post with images and videos arrays
      const post = new Post({
        title: postData.title,
        slug,
        content: postData.content,
        excerpt: postData.excerpt,
        featuredImage: postData.featuredImage,
        images: postData.images || [],
        videos: postData.videos || [],
        author: author._id,
        category: category._id,
        tags: tagIds,
        status: postData.status,
      })

      await post.save()
      createdPosts.push({
        title: post.title,
        slug: post.slug,
        category: postData.category,
      })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdPosts.length} sample posts`,
      posts: createdPosts,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating sample posts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create sample posts' },
      { status: 500 }
    )
  }
}

