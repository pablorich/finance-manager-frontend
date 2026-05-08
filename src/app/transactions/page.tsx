import { PageHeader } from "@/components/PageHeader";
import { TransactionsContainer } from "@/components/transactions/TransactionsContainer";
import { getTransactions } from "@/lib/data";

// [CONCEPT: Hybrid RSC + CSR Boundary]
// This page is a React Server Component (RSC).
// It fetches initial data server-side and passes it to a 'use client' container.
// This ensures fast initial render (LCP) and interactive filtering (UX).

// [CONCEPT: Dynamic Rendering]
// Use force-dynamic to always provide fresh transaction data.
export const dynamic = 'force-dynamic';

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string; category?: string; sort?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const page = parseInt(resolvedSearchParams?.page || "1") || 1;
  const category = resolvedSearchParams?.category || "All Categories";
  const sort = resolvedSearchParams?.sort || "Latest";

  const data = await getTransactions(query, page, category, sort);

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" />
      <TransactionsContainer initialData={data} />
    </div>
  );
}
