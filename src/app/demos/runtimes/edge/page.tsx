/**
 * Edge Runtime Demo Page
 * 
 * This page demonstrates the Next.js Edge Runtime.
 * Next.js Edge Runtime is a lightweight, performant environment based on V8 Isolates.
 * 
 * CONCEPTS:
 * - Explicit configuration: 'export const runtime = "edge"'.
 * - Restricted API access: Only Web Standard APIs are available.
 * - Performance: Faster cold starts and global distribution (when deployed).
 */

import { RuntimeInfo } from '@/components/demos/runtimes/RuntimeInfo';

// We EXPLICITLY set export const runtime here to 'edge'.
// This forces Next.js to use the Edge runtime instead of Node.js.
// IMPORTANT: In the Edge runtime, Node.js modules like 'os' or 'fs' will FAIL.
export const runtime = 'edge';

export default async function EdgeRuntimePage() {
  // 1. Web Standard API Demonstration (as required by spec)
  // We use crypto.subtle to generate a digest as a demo of Web API availability.
  const encoder = new TextEncoder();
  const data = encoder.encode('Next.js Edge Runtime');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // 2. Demonstration of a Node-only API failure handling
  // BOOTCAMP CONCEPT: This is how we prove to students that Node APIs are restricted.
  let osPlatform = 'Unavailable (Edge Runtime)';
  try {
    // We check for 'EdgeRuntime' which is a reliable global signal in Next.js Edge.
    // We avoid 'process.versions' to prevent build-time errors from the Edge checker.
    // @ts-expect-error - 'EdgeRuntime' is defined in the Edge runtime.
    if (typeof EdgeRuntime !== 'undefined') {
      osPlatform = 'Restricted: Node.js API not supported';
    } else {
      osPlatform = 'Node.js detected (Simulated/Local)';
    }
  } catch {
    osPlatform = 'Error: Node.js API not supported in Edge';
  }
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Edge Runtime Demo</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Exploring the Next.js Edge Runtime. This page runs on a lightweight 
          V8 Isolate, restricted to standard Web APIs for maximum performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Runtime Introspection Component */}
        <RuntimeInfo />

        {/* Pedagogical Explanation */}
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Why use Edge?</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Low latency and fast cold starts.</li>
              <li>Global distribution on CDNs (Edge nodes).</li>
              <li>Perfect for Middleware and dynamic personalization.</li>
              <li>Minimal footprint and memory overhead.</li>
            </ul>
            
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Web Standard API Demo (SHA-256):</p>
              <code className="text-[10px] break-all bg-muted p-2 rounded block">
                {hashHex}
              </code>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Node API Compatibility:</p>
              <p className="text-sm font-mono text-red-500 mt-1">{osPlatform}</p>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
            <strong>Bootcamp Tip:</strong> The Edge runtime has limited API access. 
            Native Node.js modules like <code className="bg-muted px-1 rounded">os</code>, <code className="bg-muted px-1 rounded">fs</code>, or <code className="bg-muted px-1 rounded">path</code> 
            will result in a build error or runtime failure if imported here.
          </div>
        </div>
      </div>
    </div>
  );
}
