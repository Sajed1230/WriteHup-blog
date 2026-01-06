# WriteHup - Blog Platform

A modern blog platform built with Next.js and Tailwind CSS.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Before running the application, you need to set up your environment variables:

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Fill in all the required environment variables in `.env.local`:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A strong random string for JWT token signing
   - `NEXT_PUBLIC_BASE_URL` - Your application URL (e.g., `http://localhost:3000`)
   - `NEXTAUTH_URL` - Same as NEXT_PUBLIC_BASE_URL
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Same as CLOUDINARY_CLOUD_NAME

**Important:** Never commit your `.env.local` file to version control. It's already included in `.gitignore`.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Modern, responsive design
- Featured post section
- Latest blog posts grid
- Categories navigation
- Trending posts section
- Search functionality (UI only)
- Clean footer with navigation links

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS






