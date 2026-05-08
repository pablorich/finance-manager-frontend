/**
 * Runtime Detector Utility
 * 
 * Provides information about the current execution environment in Next.js.
 * This is used to demonstrate the differences between Node.js and Edge runtimes.
 * 
 * CONCEPTS:
 * - Next.js can execute code in two different runtimes: Node.js (standard) and Edge (V8 Isolate).
 * - Certain APIs (like 'os' or 'fs') are only available in Node.js.
 * - Web Standard APIs (like 'crypto') are available in both.
 */

export const getRuntimeInfo = () => {
  // We check for 'EdgeRuntime' which is a reliable global signal in Next.js Edge.
  // We avoid 'process.versions' to prevent build-time errors from the Edge checker.
  // @ts-expect-error - 'EdgeRuntime' is defined in the Edge runtime.
  const isEdge = typeof EdgeRuntime !== 'undefined';
  
  return {
    name: isEdge ? 'Edge' : 'Node.js',
    type: isEdge ? 'edge' : 'nodejs',
    // Example of API availability checks
    apis: {
      hasProcess: typeof process !== 'undefined',
      hasBuffer: typeof Buffer !== 'undefined',
      hasCrypto: typeof crypto !== 'undefined',
      hasOs: !isEdge, // Simplification for demo
    },
    env: process.env.NODE_ENV || 'development',
  };
};
