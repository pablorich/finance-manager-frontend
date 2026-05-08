import CacheStatus from '@/components/ui/CacheStatus';
import RevalidateButton from '@/components/ui/revalidation/RevalidateButton';
import { purgePath } from '@/lib/actions';
import { getCacheDemoData } from '@/data/cache-demo';
import { unstable_cache } from 'next/cache';

// Using unstable_cache to keep the teaching intent of shared data cache
// while avoiding network self-fetch during prerender.
const getStaticData = unstable_cache(
  async () => getCacheDemoData(),
  ['static-demo-data'],
  { tags: ['static-demo'] }
);

export default async function StaticPage() {
  const { data, timestamp } = await getStaticData();

  const handlePurge = async () => {
    'use server';
    await purgePath('/demos/caching/static');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-stone-900">Full Route Cache (Static)</h2>
        <p className="text-stone-600">
          This page is cached at build time or on first request. Subsequent refreshes will serve the same data until revalidated.
        </p>
      </div>

      <div className="grid gap-4 max-w-md">
        <CacheStatus 
          timestamp={timestamp} 
          label="Build/Initial Fetch Age" 
        />
        
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Random Value</span>
          <span className="text-2xl font-mono text-stone-800">{data.value.toFixed(6)}</span>
        </div>

        <form action={handlePurge}>
          <RevalidateButton 
            label="Purge Path (On-Demand)"
            loadingLabel="Purging Path..."
            className="w-full py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors shadow-sm"
          />
        </form>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 space-y-2">
        <p><strong>How to test:</strong></p>
        <ol className="list-decimal ml-4 space-y-1">
          <li>Refresh the page. The timestamp and value should remain identical.</li>
          <li>Click &quot;Purge Path&quot;. This triggers a server action that calls <code>revalidatePath</code>.</li>
          <li>The page will refresh (or you can manual refresh) and you&apos;ll see a NEW timestamp and value.</li>
        </ol>
      </div>
    </div>
  );
}
