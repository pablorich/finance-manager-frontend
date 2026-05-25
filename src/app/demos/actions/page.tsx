import { getTransactions } from '@/lib/data';
import ActionsLabClient from '@/components/demos/ActionsLabClient';
import ResetButton from '@/components/demos/ResetButton';

export const metadata = {
  title: 'Server Actions Lab - Finance Manager',
  description:
    'Practice Next.js Server Actions, useActionState, and useOptimistic.',
};

export default async function ActionsLabPage() {
  // Fetch initial data on the server
  const { transactions } = await getTransactions();

  return (
    <div className="container mx-auto max-w-5xl p-6 lg:p-10">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-grey-900">
            Server Actions Lab
          </h1>
          <p className="text-grey-500">
            Experiment with mutations, revalidation, and optimistic UI updates.
          </p>
        </div>

        <ResetButton />
      </header>

      <ActionsLabClient initialTransactions={transactions} />
    </div>
  );
}
