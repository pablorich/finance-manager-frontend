import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware Demo
 * 
 * BOOTCAMP CONCEPT:
 * Middleware in Next.js runs in the Edge Runtime. This means it must only use
 * Web Standard APIs and has extremely low latency since it runs on V8 isolates.
 * 
 * Middleware is the perfect place to:
 * 1. Inspect and modify Request headers.
 * 2. Handle simple authentication or redirection.
 * 3. Log traffic metrics.
 * 
 * In this demo, we use a 'matcher' to limit its execution to specific routes,
 * ensuring it doesn't slow down the rest of our application.
 */

export function proxy(request: NextRequest) {
  // 2. Clone the request headers and add our custom 'demo' header per spec
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-middleware-demo', 'active');
  requestHeaders.set('x-runtime-source', 'Next.js Edge Middleware');

  // 3. Pass the modified headers to the underlying route
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Configure which routes this middleware should run on.
 * 
 * BOOTCAMP CONCEPT:
 * Scoping middleware with a matcher is CRITICAL for performance.
 * We only want to run this demo logic on the protected demo route.
 */
export const config = {
  matcher: '/demos/runtimes/protected/:path*',
};
