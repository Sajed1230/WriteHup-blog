/**
 * Helper function for server-side fetching in Next.js
 * Handles Render.com and other hosting environments correctly
 */
export async function serverFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  // Determine the base URL for server-side fetching
  // Priority: NEXT_PUBLIC_BASE_URL > RENDER_INTERNAL_URL > localhost
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (!baseUrl) {
    // On Render.com, use internal URL if available
    baseUrl =
      process.env.RENDER_INTERNAL_URL ||
      (process.env.NODE_ENV === 'production'
        ? `http://localhost:${process.env.PORT || '3000'}`
        : 'http://localhost:3000')
  }

  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response
  } catch (fetchError: any) {
    clearTimeout(timeoutId)
    // Enhanced error logging
    if (fetchError.name === 'AbortError') {
      console.error(`Server fetch timeout: ${path}`)
    } else if (fetchError.code === 'ECONNREFUSED') {
      console.error(
        `Server fetch connection refused: ${path}. Check if API is running and NEXT_PUBLIC_BASE_URL is correct.`
      )
      console.error(`Attempted URL: ${url}`)
    } else if (fetchError.code === 'ENOTFOUND') {
      console.error(`Server fetch DNS lookup failed: ${path}. Check NEXT_PUBLIC_BASE_URL setting.`)
      console.error(`Attempted URL: ${url}`)
    }
    throw fetchError
  }
}

