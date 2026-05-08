import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { getUserSettings, getBudgetsWithSettings } from "@/lib/data";
import { BudgetSkeleton } from "@/components/ui/Skeletons";

/**
 * Pedagogical Example: Sequential Data Fetching (Waterfall by Design)
 * 
 * In this page, we demonstrate a case where we MUST wait for the first fetch
 * (user settings) to complete before we can start the second fetch (budgets).
 */
export const metadata: Metadata = {
  title: "Budgets | Finance Manager",
  description: "Track budget limits, spending, and remaining balances.",
};

export default async function BudgetsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Budgets" />
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <p className="text-blue-700 text-sm">
          <strong>Pattern: Sequential Fetching.</strong> This page simulates a dependency where 
          budget data requires user settings to be loaded first. Note the staggered loading.
        </p>
      </div>

      <Suspense fallback={<BudgetSkeleton />}>
        <BudgetList />
      </Suspense>
    </div>
  );
}

async function BudgetList() {
  // STEP 1: Fetch settings first (Dependency)
  const settings = await getUserSettings();
  
  // STEP 2: Use settings to fetch budgets (Sequential)
  const budgets = await getBudgetsWithSettings(settings);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Active Budgets</h2>
        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
          Currency: {settings.currency}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="p-4 border border-slate-100 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-1 h-6 rounded-full" 
                  style={{ backgroundColor: budget.color }}
                />
                <span className="font-bold text-slate-700">{budget.category}</span>
              </div>
              <span className="text-slate-500 text-sm">
                Maximum ${budget.maximum.toFixed(2)}
              </span>
            </div>
            
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: budget.color,
                  width: `${Math.min((budget.spent / budget.maximum) * 100, 100)}%` 
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Spent ${budget.spent.toFixed(2)}</span>
              <span className="text-slate-400">Remaining ${(budget.maximum - budget.spent).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
