'use client';

import { useEffect } from "react";

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-xl bg-beige-100 p-8 text-center text-grey-900 shadow-sm">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-sm text-grey-500">
          We couldn’t load this page. Please try again.
        </p>
        <p className="mt-4 text-sm text-grey-900">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-grey-900 px-4 py-3 text-sm font-bold text-beige-100"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
