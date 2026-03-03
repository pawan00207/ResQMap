import { NextResponse } from 'next/server'

export default function middleware(request) {
  const response = NextResponse.next()

  // Enable caching for static assets
  if (request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    )
  }

  // Enable caching for API responses with stale-while-revalidate
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Don't cache POST requests
    if (request.method === 'GET') {
      response.headers.set(
        'Cache-Control',
        'public, max-age=300, stale-while-revalidate=3600'
      )
    }
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(self), microphone=(), camera=()'
  )

  // CORS headers for API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    if (origin === process.env.NEXT_PUBLIC_APP_URL || process.env.NODE_ENV === 'development') {
      response.headers.set('Access-Control-Allow-Origin', origin || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
