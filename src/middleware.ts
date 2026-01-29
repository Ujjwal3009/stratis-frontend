import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We can't easily access Zustand here in edge middleware,
  // so we check for the existence of the auth cookie or just rely on the frontend store redirection for now.
  // In a real app, we'd use cookies for the auth token.
  // For this implementation, we'll let the client-side store handle redirection.

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/subjects/:path*', '/test/:path*'],
};
