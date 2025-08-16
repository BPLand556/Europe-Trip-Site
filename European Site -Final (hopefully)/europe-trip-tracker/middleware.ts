import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip the passcode form page itself
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next();
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin-session');
    
    if (!adminSession) {
      // Redirect to admin login if no session
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Verify the session (in production, you'd want to verify this more securely)
    // For now, we'll just check if it exists and redirect if not
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
