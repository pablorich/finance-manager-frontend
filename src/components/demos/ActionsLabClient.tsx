'use client';

import {
  startTransition,
  useCallback,
  useMemo,
  useOptimistic,
  useState,
} from 'react';
import type { Transaction } from '@/lib/data';
import { deleteTransaction } from '@/lib/actions';
import TransactionForm from '@/components/demos/TransactionForm';
import OptimisticTransactionList from '@/components/demos/OptimisticTransactionList';
import Icon, { type IconName } from '@/components/ui/Icon';

type OptimisticAction =
  | { action: 'add'; payload: Transaction }
  | { action: 'remove'; payload: { id: string } }
  | { action: 'restore'; payload: Transaction }
  | {
      action: 'replace';
      payload: { tempId: string; transaction: Transaction };
    };

interface ActionsLabClientProps {
  initialTransactions: Transaction[];
}

type DeleteMode = 'success' | 'fail';
type ActionEventTone = 'neutral' | 'success' | 'danger';

interface ActionEvent {
  id: string;
  label: string;
  detail: string;
  tone: ActionEventTone;
}

const STAT_CARDS: Array<{
  key: 'pendingCount' | 'inflow' | 'outflow' | 'net';
  label: string;
  icon: IconName;
  valueClassName: string;
}> = [
  {
    key: 'pendingCount',
    label: 'Pending',
    icon: 'actions',
    valueClassName: 'text-grey-900',
  },
  {
    key: 'inflow',
    label: 'Inflow',
    icon: 'arrow-up',
    valueClassName: 'text-green-700',
  },
  {
    key: 'outflow',
    label: 'Outflow',
    icon: 'arrow-down',
    valueClassName: 'text-red-500',
  },
  {
    key: 'net',
    label: 'Optimistic Net',
    icon: 'wallet',
    valueClassName: 'text-grey-900',
  },
];

export default function ActionsLabClient({
  initialTransactions,
}: ActionsLabClientProps) {
  const [events, setEvents] = useState<ActionEvent[]>([
    {
      id: 'ready',
      label: 'Lab ready',
      detail: `${initialTransactions.length} transactions loaded from the mock database.`,
      tone: 'neutral',
    },
  ]);

  const [optimisticTransactions, setOptimisticTransactions] = useOptimistic(
    initialTransactions,
    (state, update: OptimisticAction) => {
      if (update.action === 'add') {
        return [update.payload, ...state];
      }

      if (update.action === 'remove') {
        return state.filter(
          (transaction) => transaction.id !== update.payload.id
        );
      }

      if (update.action === 'restore') {
        return [update.payload, ...state];
      }

      if (update.action === 'replace') {
        return state.map((transaction) =>
          transaction.id === update.payload.tempId
            ? { ...update.payload.transaction, isPending: false }
            : transaction
        );
      }

      return state;
    }
  );

  const addEvent = useCallback(
    (label: string, detail: string, tone: ActionEventTone = 'neutral') => {
      setEvents((currentEvents) =>
        [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            label,
            detail,
            tone,
          },
          ...currentEvents,
        ].slice(0, 5)
      );
    },
    []
  );

  const addOptimisticTransaction = useCallback(
    (transaction: Transaction) => {
      startTransition(() => {
        setOptimisticTransactions({ action: 'add', payload: transaction });
      });
      addEvent(
        'Optimistic row inserted',
        `${transaction.name} appears immediately while the action runs.`
      );
    },
    [addEvent, setOptimisticTransactions]
  );

  const removeOptimisticTransaction = useCallback(
    (id: string) => {
      startTransition(() => {
        setOptimisticTransactions({ action: 'remove', payload: { id } });
      });
      addEvent(
        'Optimistic row removed',
        'The temporary item was rolled back.',
        'danger'
      );
    },
    [addEvent, setOptimisticTransactions]
  );

  const confirmOptimisticTransaction = useCallback(
    (tempId: string, transaction: Transaction) => {
      startTransition(() => {
        setOptimisticTransactions({
          action: 'replace',
          payload: { tempId, transaction },
        });
      });
      addEvent(
        'Server confirmed create',
        `${transaction.name} was persisted and revalidated.`,
        'success'
      );
    },
    [addEvent, setOptimisticTransactions]
  );

  const handleDelete = useCallback(
    async (transaction: Transaction, mode: DeleteMode = 'success') => {
      if (transaction.isPending || transaction.id.startsWith('temp-')) {
        removeOptimisticTransaction(transaction.id);
        return;
      }

      startTransition(async () => {
        setOptimisticTransactions({
          action: 'remove',
          payload: { id: transaction.id },
        });
        addEvent(
          'Optimistic delete queued',
          `${transaction.name} disappeared before the server responded.`
        );

        const result = await deleteTransaction(transaction.id, mode === 'fail');
        if (!result.success) {
          setOptimisticTransactions({
            action: 'restore',
            payload: transaction,
          });
          addEvent('Delete rolled back', result.message, 'danger');
          return;
        }

        addEvent('Server confirmed delete', result.message, 'success');
      });
    },
    [addEvent, removeOptimisticTransaction, setOptimisticTransactions]
  );

  const summary = useMemo(() => {
    const pendingCount = optimisticTransactions.filter(
      (transaction) => transaction.isPending
    ).length;
    const inflow = optimisticTransactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((total, transaction) => total + transaction.amount, 0);
    const outflow = optimisticTransactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

    return {
      pendingCount,
      inflow,
      outflow,
      net: inflow - outflow,
    };
  }, [optimisticTransactions]);

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[360px_1fr]">
      <div className="lg:col-span-1">
        <div className="sticky top-10 space-y-6">
          <TransactionForm
            onAddOptimisticTransaction={addOptimisticTransaction}
            onRemoveOptimisticTransaction={removeOptimisticTransaction}
            onConfirmOptimisticTransaction={confirmOptimisticTransaction}
          />

          <div className="rounded-xl bg-grey-100 p-6">
            <h3 className="mb-2 text-sm font-bold text-grey-900">
              Action Feed
            </h3>
            <div className="space-y-3" aria-live="polite">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-grey-300 bg-white p-3"
                >
                  <p
                    className={`text-xs font-bold ${
                      event.tone === 'success'
                        ? 'text-green-700'
                        : event.tone === 'danger'
                          ? 'text-red-500'
                          : 'text-grey-900'
                    }`}
                  >
                    {event.label}
                  </p>
                  <p className="mt-1 text-xs text-grey-500">{event.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {STAT_CARDS.map((stat) => (
            <div key={stat.key} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-grey-500">
                <Icon name={stat.icon} className="h-4 w-4" />
                <p className="text-xs font-bold">{stat.label}</p>
              </div>
              <p className={`mt-2 text-2xl font-bold ${stat.valueClassName}`}>
                {stat.key === 'pendingCount'
                  ? summary.pendingCount
                  : `$${summary[stat.key].toFixed(0)}`}
              </p>
            </div>
          ))}
        </div>

        <OptimisticTransactionList
          transactions={optimisticTransactions}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
