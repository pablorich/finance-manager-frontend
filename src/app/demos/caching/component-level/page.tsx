import CacheStatus from '@/components/ui/CacheStatus';

async function getComponentData(cacheMode: RequestCache) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/cache-demo`, {
    cache: cacheMode,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default async function ComponentLevelPage() {
  // Fetch with two different cache strategies in the same request
  const [cached, uncached] = await Promise.all([
    getComponentData('force-cache'),
    getComponentData('no-store'),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-stone-900">Component-Level Cache Control</h2>
        <p className="text-stone-600">
          Next.js allows granular control over <code>fetch</code> calls within the same page.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <div className="p-2 px-3 bg-stone-200 text-stone-700 text-xs font-bold rounded w-fit uppercase">
            Strategy: force-cache
          </div>
          <CacheStatus 
            timestamp={cached.timestamp} 
            label="Cached Component Age" 
          />
          <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
            <span className="text-2xl font-mono text-stone-800">{cached.data.value.toFixed(6)}</span>
          </div>
          <p className="text-xs text-stone-500 italic">
            This component&apos;s data is stored in the Data Cache.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-2 px-3 bg-amber-200 text-amber-800 text-xs font-bold rounded w-fit uppercase">
            Strategy: no-store
          </div>
          <CacheStatus 
            timestamp={uncached.timestamp} 
            label="Uncached Component Age" 
          />
          <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
            <span className="text-2xl font-mono text-stone-800">{uncached.data.value.toFixed(6)}</span>
          </div>
          <p className="text-xs text-stone-500 italic">
            This component bypasses the cache and fetches fresh every time.
          </p>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800">
        <strong>How to test:</strong> Refresh the page. The left side (Cached) will stay frozen with its original value and timestamp, while the right side (Uncached) will update every time you refresh.
      </div>
    </div>
  );
}
