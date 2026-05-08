import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { getRecurringBills, Bill } from "@/lib/data";
import { BillSkeleton } from "@/components/ui/Skeletons";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Recurring Bills | Finance Manager",
  description: "Review upcoming and paid recurring bills.",
};

/**
 * Pedagogical Example: Parallel Fetching with Granular Streaming
 * 
 * In this page, we fetch the same data source but demonstrate how to 
 * wrap multiple components in independent Suspense boundaries to 
 * see them "pop in" as they finish.
 */
export default async function RecurringBillsPage() {
  // Initiate fetch at the top level to start the "request" as early as possible
  const billsPromise = getRecurringBills();

  return (
    <div className="space-y-6">
      <PageHeader title="Recurring Bills" />

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-green-700 text-sm">
          <strong>Pattern: Parallel Fetching & Streaming.</strong> These sections share a data 
          promise but are wrapped in separate Suspense boundaries for granular loading feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Suspense fallback={<BillSkeleton />}>
            <BillsSummary billsPromise={billsPromise} />
          </Suspense>
        </div>
        
        <div className="lg:col-span-2">
          <Suspense fallback={<BillSkeleton />}>
            <BillsList billsPromise={billsPromise} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function BillsSummary({ billsPromise }: { billsPromise: Promise<Bill[]> }) {
  const bills = await billsPromise;
  
  const totalPaid = bills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  const totalUpcoming = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md h-full">
      <h2 className="text-xl font-bold mb-8">Summary</h2>
      
      <div className="space-y-6">
        <div>
          <p className="text-slate-400 text-sm mb-1">Total Paid</p>
          <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
        </div>
        
        <div className="pt-6 border-t border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Upcoming</p>
          <p className="text-2xl font-bold">${totalUpcoming.toFixed(2)}</p>
        </div>
        
        <div className="pt-6 border-t border-slate-700 text-xs text-slate-400 italic">
          * Calculated from {bills.length} recurring items
        </div>
      </div>
    </div>
  );
}

async function BillsList({ billsPromise }: { billsPromise: Promise<Bill[]> }) {
  const bills = await billsPromise;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Detailed Bills</h2>
      
      <div className="space-y-4">
        {bills.map((bill) => (
          <div key={bill.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${bill.isPaid ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="font-bold text-slate-700">{bill.name}</p>
                <p className="text-xs text-slate-500">{bill.dueDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">${bill.amount.toFixed(2)}</p>
              <p className={`text-[10px] uppercase font-bold ${bill.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                {bill.isPaid ? 'Paid' : 'Upcoming'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
