'use client';

import { useTransition } from 'react';
import { resetDatabase } from '@/lib/actions';
import Icon from '@/components/ui/Icon';

export default function ResetButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await resetDatabase();
        })
      }
      className="inline-flex items-center gap-2 rounded-lg border border-grey-300 px-4 py-2 text-sm font-medium text-grey-900 transition-colors hover:bg-grey-100 disabled:opacity-50"
    >
      <Icon
        name="reset"
        className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`}
      />
      {isPending ? 'Resetting...' : 'Reset Lab Data'}
    </button>
  );
}
