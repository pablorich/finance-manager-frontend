import Link from 'next/link';

export default function CachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demos = [
    { name: 'Static (Default)', path: '/demos/caching/static' },
    { name: 'Dynamic (Forced)', path: '/demos/caching/dynamic' },
    { name: 'Time-based (ISR)', path: '/demos/caching/revalidate' },
    { name: 'Component-Level', path: '/demos/caching/component-level' },
  ];

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          Next.js Caching & Revalidation Lab
        </h1>
        <p className="max-w-3xl text-stone-600 leading-relaxed">
          Welcome to the Caching Lab. Use the navigation below to explore different caching behaviors. 
          To force a server hit for demonstration purposes, we use <code>prefetch={'{false}'}</code> on these links.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6 bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">1. Static vs Dynamic</h3>
            <p className="text-xs text-stone-500 leading-normal">
              Compare <strong>Static</strong> (cached at build time) vs <strong>Dynamic</strong> (fetched every request).
              Notice the timestamp behavior when refreshing.
            </p>
          </div>
          <div className="flex flex-col gap-2 border-l border-stone-100 pl-6">
            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">2. ISR (Time-based)</h3>
            <p className="text-xs text-stone-500 leading-normal">
              Set to <code>revalidate = 60</code>. Refreshing after 60s serves stale data once, 
              triggers a background update, and shows new data on the <em>next</em> refresh.
            </p>
          </div>
          <div className="flex flex-col gap-2 border-l border-stone-100 pl-6">
            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">3. On-Demand Purge</h3>
            <p className="text-xs text-stone-500 leading-normal">
              Click <strong>Purge Path</strong> or <strong>Revalidate Tag</strong> to manually 
              invalidate the cache using Server Actions.
            </p>
          </div>
          <div className="flex flex-col gap-2 border-l border-stone-100 pl-6">
            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">4. Cache Status</h3>
            <p className="text-xs text-stone-500 leading-normal">
               Watch the <strong>CacheStatus</strong> component. It calculates &quot;Data Age&quot; 
              based on the difference between client and server time.
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-4 mt-4">
          {demos.map((demo) => (
            <Link
              key={demo.path}
              href={demo.path}
              prefetch={false}
              className="px-4 py-2 text-sm font-semibold bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-all hover:border-stone-400 active:bg-stone-100 shadow-sm"
            >
              {demo.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 bg-stone-50/50 p-8 rounded-2xl border border-stone-200/50 min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
