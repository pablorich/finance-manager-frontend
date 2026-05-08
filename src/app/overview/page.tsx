import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { OverviewBalance } from "@/components/overview/OverviewBalance";
import { OverviewTransactions } from "@/components/overview/OverviewTransactions";
import { OverviewBudgets } from "@/components/overview/OverviewBudgets";
import { BalanceSkeleton, TransactionRowSkeleton, BudgetSkeleton } from "@/components/ui/Skeletons";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Overview | Finance Manager",
  description: "View your financial overview, recent transactions, and budgets.",
};

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Overview" />

      {/* 
        Requirement: Granular Streaming with Suspense
        Requirement: Server-Side Parallel Orchestration
        These independent async components trigger their own data fetching. 
        Next.js will stream the results as they become available.
      */}

      <Suspense fallback={<BalanceSkeleton />}>
        <OverviewBalance />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-6">
                <div className="h-6 w-32 bg-slate-100 animate-pulse rounded"></div>
             </div>
             <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <TransactionRowSkeleton key={i} />)}
             </div>
          </div>
        }>
          <OverviewTransactions />
        </Suspense>

        <Suspense fallback={<BudgetSkeleton />}>
          <OverviewBudgets />
        </Suspense>
      </div>
    </div>
  );
}
