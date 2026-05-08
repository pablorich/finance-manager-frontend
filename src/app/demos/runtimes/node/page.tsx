/**
 * Node.js Runtime Demo Page
 * 
 * This page demonstrates the default Next.js execution environment (Node.js).
 * Node.js is the standard runtime for Server Components, Route Handlers, and Server Actions.
 * 
 * CONCEPTS:
 * - Default runtime: If not specified, Next.js uses the Node.js runtime.
 * - Full API access: Access to both Web Standard APIs and Node-specific APIs (os, fs, path).
 * - Ideal for: Database interactions, complex computations, and using the full npm ecosystem.
 */

import { RuntimeInfo } from '@/components/demos/runtimes/RuntimeInfo';
import os from 'os';

// We explicitly NOT set export const runtime here because 'nodejs' is the default.
// This allows us to use Node.js specific APIs if needed.

export default function NodeRuntimePage() {
  // Demonstration of a Node-only API access
  const platform = os.platform();
  const cpus = os.cpus().length;
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Node.js Runtime Demo</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Exploring the standard Next.js execution environment. This page runs on the 
          full Node.js runtime, allowing access to the entire Node.js ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Runtime Introspection Component */}
        <RuntimeInfo />

        {/* Pedagogical Explanation */}
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
            <h2 className="text-xl font-bold mb-4">Why use Node.js?</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Access to <code className="bg-muted px-1 rounded">fs</code>, <code className="bg-muted px-1 rounded">os</code>, and other native modules.</li>
              <li>Full compatibility with existing Node.js libraries and SDKs.</li>
              <li>No restriction on the standard Web API set.</li>
              <li>Standard environment for most Server-Side Rendering (SSR) tasks.</li>
            </ul>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Host Info (Node-only):</p>
              <p className="text-sm font-mono text-green-600 mt-1">Platform: {platform} | CPUs: {cpus}</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 text-sm">
            <strong>Bootcamp Tip:</strong> In the App Router, this is the default behavior.
            You don&apos;t need any special configuration unless you want to switch to the Edge runtime.
          </div>
        </div>
      </div>
    </div>
  );
}
