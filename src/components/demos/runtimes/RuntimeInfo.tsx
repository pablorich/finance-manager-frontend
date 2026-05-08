/**
 * RuntimeInfo Component
 * 
 * Displays details about the current Next.js runtime (Node.js vs Edge).
 * This component is designed for pedagogical purposes to help students visualize
 * the differences in the execution environment of their routes.
 * 
 * CONCEPTS:
 * - Runtime configuration: Next.js routes can explicitly set 'runtime = "edge"'.
 * - API Constraints: Certain APIs are only available in specific runtimes.
 * - This component should be used in both Server and Client environments (if hydrated correctly).
 */

import { getRuntimeInfo } from '@/lib/runtimes/detector';

export function RuntimeInfo() {
  const info = getRuntimeInfo();

  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h2 className="text-xl font-bold mb-4">Current Runtime Details</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Runtime Name</p>
          <p className={`text-lg font-bold ${info.type === 'edge' ? 'text-blue-500' : 'text-green-500'}`}>
            {info.name}
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Identifier</p>
          <code className="text-xs bg-muted px-1 py-0.5 rounded">{info.type}</code>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2">Available APIs (Introspection)</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between items-center border-b pb-1">
            <span>process</span>
            <span className={info.apis.hasProcess ? 'text-green-600' : 'text-red-600'}>
              {info.apis.hasProcess ? '✅ Available' : '❌ Missing'}
            </span>
          </li>
          <li className="flex justify-between items-center border-b pb-1">
            <span>Buffer</span>
            <span className={info.apis.hasBuffer ? 'text-green-600' : 'text-red-600'}>
              {info.apis.hasBuffer ? '✅ Available' : '❌ Missing'}
            </span>
          </li>
          <li className="flex justify-between items-center border-b pb-1">
            <span>Web Crypto (globalThis.crypto)</span>
            <span className={info.apis.hasCrypto ? 'text-green-600' : 'text-red-600'}>
              {info.apis.hasCrypto ? '✅ Available' : '❌ Missing'}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>Native Node Modules (e.g. &apos;os&apos;)</span>
            <span className={info.apis.hasOs ? 'text-green-600' : 'text-red-600'}>
              {info.apis.hasOs ? '✅ Available' : '❌ Restricted'}
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-6 p-3 bg-muted/50 rounded text-xs text-muted-foreground italic">
        {info.type === 'edge' 
          ? "💡 NOTE: The Edge runtime uses V8 Isolate and only supports Web Standard APIs. It is lightweight and highly performant for middleware and specific routes."
          : "💡 NOTE: The Node.js runtime is the standard execution environment. It has access to the full Node.js API ecosystem and ecosystem libraries."
        }
      </div>
    </div>
  );
}
