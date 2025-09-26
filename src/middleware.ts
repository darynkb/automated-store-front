import { NextRequest, NextResponse } from 'next/server'
import { detectDeviceFromUserAgent } from './lib/device-detection'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Get device type with override support
  const url = new URL(request.url)
  const searchString = url.search
  const deviceOverride = url.searchParams.get('device')
  
  let deviceType: 'mobile' | 'desktop'
  
  if (deviceOverride === 'mobile' || deviceOverride === 'desktop') {
    deviceType = deviceOverride
  } else {
    deviceType = detectDeviceFromUserAgent(userAgent)
  }
  
  // Handle root path routing based on device type
  if (pathname === '/') {
    if (deviceType === 'mobile') {
      // Redirect mobile devices to mobile scanner interface
      return NextResponse.rewrite(new URL('/mobile' + search, request.url))
    } else {
      // Redirect desktop devices to desktop display interface
      return NextResponse.rewrite(new URL('/desktop' + search, request.url))
    }
  }
  
  // Handle explicit mobile/desktop routes
  if (pathname === '/mobile' || pathname === '/desktop') {
    // Allow access to explicit routes regardless of device type
    // This enables manual override and testing
    return NextResponse.next()
  }
  
  // For all other routes, continue normally
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}