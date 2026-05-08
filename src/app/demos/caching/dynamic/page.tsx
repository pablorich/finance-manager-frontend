import CacheStatus from '@/components/ui/CacheStatus';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

async function getDynamicData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/cache-demo`, {
    // We can also use cache: 'no-store' for fetch-level dynamic behavior
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default async function DynamicPage() {
  const { data, timestamp } = await getDynamicData();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-stone-900">Dynamic Rendering (Forced)</h2>
        <p className="text-stone-600">
          This page is rendered on every request. Data is never cached for the long term.
        </p>
      </div>

      <div className="grid gap-4 max-w-md">
        <CacheStatus 
          timestamp={timestamp} 
          label="Last Fetch Age" 
        />
        
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Random Value</span>
          <span className="text-2xl font-mono text-stone-800">{data.value.toFixed(6)}</span>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        <strong>How to test:</strong> Refresh the page. Both the timestamp and the random value will update on every single hit because <code>force-dynamic</code> is enabled.
      </div>
    </div>
  );
}
