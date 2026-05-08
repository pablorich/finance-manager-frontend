'use client';

import { useOptimistic, startTransition, useEffect } from 'react';
import { Transaction } from '@/lib/types';
import { deleteTransaction } from '@/lib/actions';
import Avatar from '@/components/ui/Avatar';

interface OptimisticTransactionListProps {
  initialTransactions: Transaction[];
}

export default function OptimisticTransactionList({
  initialTransactions,
}: OptimisticTransactionListProps) {
  const [optimisticTransactions, setOptimisticTransactions] = useOptimistic(
    initialTransactions,
    (state, { action, payload }: { action: 'delete' | 'add'; payload: string | Transaction }) => {
      if (action === 'delete') {
        return state.filter((t) => t.id !== payload);
      }
      if (action === 'add' && typeof payload !== 'string') {
        return [payload, ...state];
      }
      return state;
    }
  );

  // Expose the optimistic adder via window for verification/integration demo
  // In a real app, this would be passed via context or props to the form.
  // Move to useEffect to avoid side effects in render.
  useEffect(() => {
    window.addOptimisticTransaction = (transaction: Transaction) => {
      startTransition(() => {
        setOptimisticTransactions({ action: 'add', payload: transaction });
      });
    };
    return () => {
      delete window.addOptimisticTransaction;
    };
  }, [setOptimisticTransactions]);

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      setOptimisticTransactions({ action: 'delete', payload: id });
      const result = await deleteTransaction(id);
      if (!result.success) {
        console.error('Delete failed:', result.message);
      }
    });
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-grey-900">Recent Transactions</h2>
        <span className="text-xs text-grey-500">
          Showing {optimisticTransactions.length} items
        </span>
      </div>

      <div className="space-y-4">
        {optimisticTransactions.length === 0 ? (
          <p className="py-10 text-center text-sm text-grey-500">No transactions found.</p>
        ) : (
          optimisticTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between border-b border-grey-100 pb-4 last:border-0 last:pb-0 ${
                transaction.isPending === true ? 'opacity-50' : ''
              }`}
            >
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
                  <h3 className="text-sm font-bold text-grey-900">{transaction.name}</h3>
                  <p className="text-xs text-grey-500">{transaction.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className={`text-sm font-bold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-700'}`}>
                    {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-grey-500">
                    {new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                  </p>
                </div>
                
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="text-xs font-medium text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
