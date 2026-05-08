import { getTransactions } from "@/lib/data";
import Link from "next/link";

export async function RecentTransactions() {
  const { transactions } = await getTransactions();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-public-sans text-slate-900">Recent Transactions</h2>
        <Link 
          href="/transactions" 
          className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors"
        >
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden relative">
                {/* Fallback if image doesn't exist in public */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-200 uppercase font-bold text-xs">
                  {tx.name.charAt(0)}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold font-public-sans text-slate-900">{tx.name}</p>
                <p className="text-xs text-slate-500">{tx.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold font-public-sans ${tx.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
