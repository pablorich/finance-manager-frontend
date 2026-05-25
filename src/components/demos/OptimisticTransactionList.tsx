'use client';

import type { Transaction } from '@/lib/data';
import Avatar from '@/components/ui/Avatar';
import Icon from '@/components/ui/Icon';

interface OptimisticTransactionListProps {
  transactions: Transaction[];
  onDelete: (transaction: Transaction, mode?: 'success' | 'fail') => void;
}

export default function OptimisticTransactionList({
  transactions,
  onDelete,
}: OptimisticTransactionListProps) {
  const pendingCount = transactions.filter(
    (transaction) => transaction.isPending
  ).length;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-grey-900">Optimistic Ledger</h2>
          <p className="text-xs text-grey-500">
            Showing {transactions.length} items
            {pendingCount > 0 ? `, ${pendingCount} pending` : ''}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-grey-100 px-3 py-1 text-xs font-bold text-grey-500">
          <Icon name="actions" className="h-3.5 w-3.5" />
          useOptimistic preview
        </span>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="py-10 text-center text-sm text-grey-500">
            No transactions found.
          </p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex flex-col gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                transaction.isPending === true
                  ? 'border-green-600 bg-green-50'
                  : 'border-grey-100 bg-white'
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
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-grey-900">
                      {transaction.name}
                    </h3>
                    {transaction.isPending === true ? (
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-green-600">
                        Pending
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-grey-500">
                    {transaction.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 sm:justify-end">
                <div className="text-left sm:text-right">
                  <p
                    className={`text-sm font-bold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-700'}`}
                  >
                    {transaction.amount < 0 ? '-' : '+'}$
                    {Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-grey-500">
                    {new Date(transaction.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </p>
                </div>

                <div className="flex min-w-24 items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onDelete(transaction)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50"
                    aria-label={`Delete ${transaction.name}`}
                    title={transaction.isPending ? 'Cancel' : 'Delete'}
                  >
                    <Icon
                      name={transaction.isPending ? 'cancel' : 'delete'}
                      className="h-4 w-4"
                    />
                  </button>
                  {!transaction.isPending &&
                  !transaction.id.startsWith('temp-') ? (
                    <button
                      type="button"
                      onClick={() => onDelete(transaction, 'fail')}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-amber-600 transition-colors hover:bg-amber-50"
                      aria-label={`Simulate failed delete for ${transaction.name}`}
                      title="Rollback test"
                    >
                      <Icon name="rollback" className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
