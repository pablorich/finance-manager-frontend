import { NextResponse } from 'next/server';

/**
 * Next.js Edge Runtime Route Handler Demo
 * 
 * BOOTCAMP CONCEPT:
 * This API route is explicitly configured to run on the Edge Runtime.
 * Edge routes are lightweight, run on V8 isolates, and have access to Web Standard APIs
 * but lack some Node.js specific globals (like 'process.versions.node' in production).
 * 
 * We use 'export const runtime = "edge"' to force this route into the Edge Runtime.
 */
export const runtime = 'edge';

export async function GET() {
  // Check for the presence of the Next.js Edge Runtime global.
  // In the Edge runtime, 'EdgeRuntime' is defined as a string (e.g., 'edge-runtime').
  // This is a safe way to detect the Edge environment without accessing Node-specific 'process.versions'.
  // @ts-expect-error - 'EdgeRuntime' is a global injected by the Next.js Edge runtime environment.
  const isEdge = typeof EdgeRuntime !== 'undefined';
  
  return NextResponse.json({
    message: 'Hello from the Edge!',
    runtime: isEdge ? 'Edge (V8 Isolate)' : 'Node.js (Simulated/Local)',
    timestamp: new Date().toISOString(),
    // Edge runtime has access to standard Web APIs like Crypto
    cryptoAvailable: typeof crypto !== 'undefined' && !!crypto.randomUUID,
    // Demonstrate that we can access the Request/Response context easily
    env: process.env.NODE_ENV,
  });
}
