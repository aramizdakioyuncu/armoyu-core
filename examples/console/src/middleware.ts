import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for the armoyu_token cookie
  const token = request.cookies.get('armoyu_token')?.value;
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  // If trying to access dashboard without a token, redirect to home
  if (isDashboard && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Match only dashboard routes
export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};
