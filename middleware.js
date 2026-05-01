import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token')?.value;

  const isAuthPage = 
    req.nextUrl.pathname.startsWith('/login') || 
    req.nextUrl.pathname.startsWith('/register') ||
    req.nextUrl.pathname.startsWith('/forgot-password') ||
    req.nextUrl.pathname.startsWith('/reset-password');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');

  const isRootPage = req.nextUrl.pathname === '/';

  if (!token && !isAuthPage && !isApiRoute && !isRootPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/board', req.url));
  }

  // Admin Route Protection
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token) return NextResponse.redirect(new URL('/login', req.url));
    // We can't easily check DB in middleware without a performance hit, 
    // but the AdminPanel itself will handle the deep check.
    // This just ensures we don't redirect away prematurely if a token exists.
  }

  // Very basic API route protection
  if (!token && isApiRoute && !req.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Enhanced API Security: Enforce JSON for mutations
  if (isApiRoute && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers.get('content-type');
    // Allow if no content type (empty body) or if it's JSON
    if (contentType && !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Unsupported Media Type: Application must use JSON' }, { status: 415 });
    }
  }

  // Add basic security headers
  const response = NextResponse.next();
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
