import CacheStatus from '@/components/ui/CacheStatus';
import RevalidateButton from '@/components/ui/revalidation/RevalidateButton';
import { purgeTag } from '@/lib/actions';
import { getCacheDemoData } from '@/data/cache-demo';
import { unstable_cache } from 'next/cache';

// Time-based revalidation (ISR) at the segment level
export const revalidate = 60;

// Using unstable_cache to keep the teaching intent of shared data cache
// while avoiding network self-fetch during prerender.
const getISRData = unstable_cache(
  async () => getCacheDemoData(),
  ['isr-demo-data'],
  { tags: ['isr-demo'] }
);

export default async function ISRPage() {
  const { data, timestamp } = await getISRData();

  const handlePurgeTag = async () => {
    'use server';
    await purgeTag('isr-demo');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-stone-900">Incremental Static Regeneration (ISR)</h2>
        <p className="text-stone-600">
          This page revalidates every 60 seconds automatically, or on-demand via tags.
        </p>
      </div>

      <div className="grid gap-4 max-w-md">
        <CacheStatus 
          timestamp={timestamp} 
          label="Data Age" 
          revalidate={60}
        />
        
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Random Value</span>
          <span className="text-2xl font-mono text-stone-800">{data.value.toFixed(6)}</span>
        </div>

        <form action={handlePurgeTag}>
          <RevalidateButton 
            label="Revalidate Tag (On-Demand)"
            loadingLabel="Revalidating Tag..."
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-sm"
          />
        </form>
      </div>
      
      <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 space-y-4">
        <div>
          <p><strong>Option 1: Time-based ISR</strong></p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Establish initial cache by refreshing.</li>
            <li>Wait for the indicator to turn <span className="text-rose-600 font-bold uppercase">Red</span> (after 60s).</li>
            <li>Refresh once more. You&apos;ll see STALE data, but a background update is triggered.</li>
            <li>Refresh again. Now you see the NEW data.</li>
          </ol>
        </div>

        <div>
          <p><strong>Option 2: On-demand Revalidation</strong></p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Click &quot;Revalidate Tag&quot;. This immediately invalidates anything with the <code>&apos;isr-demo&apos;</code> tag.</li>
            <li>On next refresh, you will see NEW data immediately, bypassing the 60s timer.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
