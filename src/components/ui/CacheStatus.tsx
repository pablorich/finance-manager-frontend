'use client';

import { useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

interface CacheStatusProps {
  timestamp: number;
  label?: string;
  revalidate?: number | false;
}

export default function CacheStatus({ timestamp, label = 'Data Age', revalidate }: CacheStatusProps) {
  const now = useSyncExternalStore(
    (onStoreChange) => {
      const interval = setInterval(onStoreChange, 1000);
      return () => clearInterval(interval);
    },
    () => Date.now(),
    () => timestamp
  );
  const effectiveNow = now !== timestamp ? now : timestamp;
  const secondsAgo = Math.floor((effectiveNow - timestamp) / 1000);
  const isStale = revalidate && secondsAgo >= revalidate;

  // Visual feedback: green for fresh, yellow for nearing revalidation, red for stale
  const getStatusColor = () => {
    if (!revalidate) return 'bg-emerald-500';
    if (secondsAgo >= revalidate) return 'bg-rose-500';
    if (secondsAgo >= revalidate * 0.75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-lg shadow-sm">
      <div className={cn("w-3 h-3 rounded-full animate-pulse", getStatusColor())} />
      <div className="flex flex-col">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-medium text-stone-800">
          {secondsAgo}s ago <span className="text-stone-400 font-normal">({new Date(timestamp).toLocaleTimeString('en-GB', { timeZone: 'UTC' })})</span>
        </span>
        {revalidate && (
          <span className="text-[10px] text-stone-400">
            Revalidates every {revalidate}s {isStale && '• STALE'}
          </span>
        )}
      </div>
    </div>
  );
}
