import { getBudgets } from "@/lib/data";
import Link from "next/link";

export async function OverviewBudgets() {
  const budgets = await getBudgets();

  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = budgets.reduce((sum, b) => sum + b.maximum, 0);
  const spentPercentage = totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Budgets</h2>
        <Link href="/budgets" className="text-sm text-slate-500 hover:text-slate-900">See Details</Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Simple Chart Placeholder */}
        <div className="relative h-40 w-40 flex items-center justify-center">
          <svg className="h-full w-full" viewBox="0 0 36 36" aria-hidden="true">
            <path
              className="text-slate-100"
              strokeDasharray="100, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="text-slate-900"
              strokeDasharray={`${spentPercentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-slate-900">${totalSpent.toFixed(0)}</span>
            <span className="text-xs text-slate-500 text-center">of ${totalLimit.toFixed(0)} limit</span>
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full">
          {budgets.map((budget: import("@/lib/data").Budget) => (
            <div key={budget.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 rounded-full" style={{ backgroundColor: budget.color }}></div>
                <div>
                  <p className="text-xs text-slate-500">{budget.category}</p>
                  <p className="font-bold text-slate-900">${budget.spent.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
