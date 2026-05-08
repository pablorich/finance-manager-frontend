import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { getPots } from "@/lib/data";
import { Skeleton } from "@/components/ui/Skeletons";

/**
 * Standard Pattern: Simple Async Component with Suspense
 */
export const metadata: Metadata = {
  title: "Pots | Finance Manager",
  description: "See your savings pots and progress toward each target.",
};

export default async function PotsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pots" />
      
      <Suspense fallback={<PotsSkeleton />}>
        <PotsList />
      </Suspense>
    </div>
  );
}

async function PotsList() {
  const pots = await getPots();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pots.map((pot) => (
        <div key={pot.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pot.color }} />
              <h3 className="font-bold text-lg text-slate-900">{pot.name}</h3>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <span className="sr-only">Options</span>
              •••
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Total Saved</span>
              <span className="text-2xl font-bold text-slate-900">${pot.total.toFixed(2)}</span>
            </div>
            
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: pot.color,
                  width: `${Math.min((pot.total / pot.target) * 100, 100)}%` 
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">{((pot.total / pot.target) * 100).toFixed(1)}%</span>
              <span className="text-slate-500">Target of ${pot.target.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PotsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between mb-8">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-8" />
          </div>
          <div className="space-y-6">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
