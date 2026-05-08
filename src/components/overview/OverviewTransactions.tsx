import { getTransactions } from "@/lib/data";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";

export async function OverviewTransactions() {
  const { transactions } = await getTransactions();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Transactions</h2>
        <Link href="/transactions" className="text-sm text-slate-500 hover:text-slate-900">View All</Link>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-4">
              <Avatar 
                src={transaction.avatar} 
                alt={transaction.name}
                width={40}
                height={40}
                className="h-10 w-10"
                fallbackText={transaction.name.charAt(0)}
              />
              <div>
                <p className="font-bold text-slate-900">{transaction.name}</p>
                <p className="text-sm text-slate-500">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
