'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import type { Transaction } from '@/lib/data';
import { createTransaction, ActionState } from '@/lib/actions';
import { TRANSACTION_CATEGORIES } from '@/lib/constants';
import Icon, { type IconName } from '@/components/ui/Icon';

const initialState: ActionState = {
  success: false,
  message: '',
};

interface TransactionFormProps {
  onAddOptimisticTransaction: (transaction: Transaction) => void;
  onRemoveOptimisticTransaction: (id: string) => void;
  onConfirmOptimisticTransaction: (
    tempId: string,
    transaction: Transaction
  ) => void;
}

interface TransactionScenario {
  label: string;
  name: string;
  amount: string;
  category: string;
  icon: IconName;
}

const TRANSACTION_SCENARIOS: TransactionScenario[] = [
  {
    label: 'Payday',
    name: 'Design Contract',
    amount: '860',
    category: 'General',
    icon: 'arrow-up',
  },
  {
    label: 'Lunch',
    name: 'Market Hall Lunch',
    amount: '-28.40',
    category: 'Dining Out',
    icon: 'arrow-down',
  },
  {
    label: 'Bills',
    name: 'Fiber Internet',
    amount: '-64.99',
    category: 'Bills',
    icon: 'recurring-bills',
  },
  {
    label: 'Fail',
    name: 'error reimbursement',
    amount: '42',
    category: 'General',
    icon: 'rollback',
  },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-grey-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-grey-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Processing...' : 'Add Transaction'}
    </button>
  );
}

export default function TransactionForm({
  onAddOptimisticTransaction,
  onRemoveOptimisticTransaction,
  onConfirmOptimisticTransaction,
}: TransactionFormProps) {
  const [state, formAction] = useActionState(createTransaction, initialState);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const pendingTempIdRef = useRef<string | null>(null);

  useEffect(() => {
    const pendingTempId = pendingTempIdRef.current;
    if (!pendingTempId || !state.message) {
      return;
    }

    if (state.success && state.data) {
      onConfirmOptimisticTransaction(pendingTempId, state.data);
    } else {
      onRemoveOptimisticTransaction(pendingTempId);
    }

    pendingTempIdRef.current = null;
  }, [onConfirmOptimisticTransaction, onRemoveOptimisticTransaction, state]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const submittedName = (formData.get('name') as string) || '';
    const submittedAmount = parseFloat(
      (formData.get('amount') as string) || ''
    );
    const submittedCategory = (formData.get('category') as string) || '';

    if (submittedName && !Number.isNaN(submittedAmount) && submittedCategory) {
      const tempId = `temp-${Date.now()}`;
      pendingTempIdRef.current = tempId;
      onAddOptimisticTransaction({
        id: tempId,
        name: submittedName,
        amount: submittedAmount,
        category: submittedCategory,
        date: new Date().toISOString(),
        avatar: '/avatars/general.jpg',
        isPending: true,
      });
      setName('');
      setAmount('');
      setCategory('');
    }
  };

  const applyScenario = (scenario: TransactionScenario) => {
    setName(scenario.name);
    setAmount(scenario.amount);
    setCategory(scenario.category);
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
    >
      <div>
        <p className="text-xs font-bold uppercase text-green-600">
          Server Action Playground
        </p>
        <h2 className="mt-1 text-xl font-bold text-grey-900">
          Add a Transaction
        </h2>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-grey-500">Quick scenarios</p>
        <div className="grid grid-cols-2 gap-2">
          {TRANSACTION_SCENARIOS.map((scenario) => (
            <button
              key={scenario.label}
              type="button"
              onClick={() => applyScenario(scenario)}
              className="flex items-center gap-2 rounded-lg border border-grey-300 px-3 py-2 text-left text-xs font-bold text-grey-900 transition-colors hover:border-green-600 hover:bg-grey-100"
              aria-label={`Fill form with ${scenario.label} scenario`}
            >
              <Icon name={scenario.icon} className="h-4 w-4 text-green-600" />
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      {state.message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            state.success
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {state.message}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-xs font-bold text-grey-500"
        >
          Transaction Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          minLength={3}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Monthly Rent"
          className={`w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-grey-900 ${
            state.errors?.name ? 'border-red-500' : 'border-grey-300'
          }`}
        />
        {state.errors?.name && (
          <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="amount"
          className="mb-1 block text-xs font-bold text-grey-500"
        >
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          required
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="e.g. 1500"
          className={`w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-grey-900 ${
            state.errors?.amount ? 'border-red-500' : 'border-grey-300'
          }`}
        />
        {state.errors?.amount && (
          <p className="mt-1 text-xs text-red-500">{state.errors.amount[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-xs font-bold text-grey-500"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={`w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-grey-900 ${
            state.errors?.category ? 'border-red-500' : 'border-grey-300'
          }`}
        >
          <option value="">Select Category</option>
          {TRANSACTION_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {state.errors?.category && (
          <p className="mt-1 text-xs text-red-500">
            {state.errors.category[0]}
          </p>
        )}
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>

      <p className="text-center text-[10px] text-grey-500">
        Tip: Type &quot;error&quot; in name to simulate a server failure.
      </p>
    </form>
  );
}
