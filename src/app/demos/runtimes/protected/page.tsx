import { headers } from 'next/headers';

/**
 * Next.js Middleware Interception Demo Page
 * 
 * BOOTCAMP CONCEPT:
 * This page receives custom headers injected by the Next.js Edge Middleware.
 * Since Middleware runs before the target route, we can 'decorate' the Request object
 * with additional context, such as user metadata or system markers.
 * 
 * We use 'headers()' from 'next/headers' to read these custom markers
 * and prove the Middleware successfully intercepted the request.
 */
export default async function ProtectedDemoPage() {
  const headerStore = await headers();
  const injectedHeader = headerStore.get('x-middleware-demo');
  const runtimeSource = headerStore.get('x-runtime-source');

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Middleware Interception</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Visualizing the custom headers injected by the Edge-based Middleware 
          during the request lifecycle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-purple-600">Middleware Context</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-semibold text-muted-foreground">Header Injected:</span>
              <span className={`font-mono ${injectedHeader === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {injectedHeader || 'No'}
              </span>
              
              <span className="font-semibold text-muted-foreground">Source Runtime:</span>
              <span className="font-mono text-blue-600">
                {runtimeSource || 'Unknown'}
              </span>
            </div>

            <div className="p-4 bg-muted rounded border text-xs overflow-auto">
              <p className="font-bold mb-1">Raw Headers (Injected):</p>
              <pre>
                {JSON.stringify({
                  'x-middleware-demo': injectedHeader,
                  'x-runtime-source': runtimeSource,
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
            <h2 className="text-xl font-bold mb-4">How it works?</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm">
              <li>Request hits <code className="bg-muted px-1 rounded">/demos/runtimes/protected</code>.</li>
              <li>Next.js identifies the <code className="bg-muted px-1 rounded">proxy.ts</code> matcher.</li>
              <li>Middleware runs in the <strong>Edge Runtime</strong>.</li>
              <li>Custom headers are appended to the request.</li>
              <li>Next.js renders this Server Component and retrieves the headers.</li>
            </ol>
          </div>

          <div className="p-4 bg-purple-50 border-l-4 border-purple-400 text-purple-800 text-sm italic">
            <strong>Bootcamp Insight:</strong> Use Middleware sparingly. 
            Keep it fast and focused, as it adds latency to every matched request.
          </div>
        </div>
      </div>
    </div>
  );
}
