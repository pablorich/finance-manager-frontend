'use client';

import { Transaction, TransactionResponse } from "@/lib/data";
import { TRANSACTION_CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import useSWR from "swr";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Avatar from "@/components/ui/Avatar";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
});

function DebouncedSearch({ initialValue, onSearch }: { initialValue: string; onSearch: (v: string) => void }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (value === initialValue) return;
    const timer = setTimeout(() => onSearch(value), 500);
    return () => clearTimeout(timer);
  }, [value, initialValue, onSearch]);

  return (
    <div className="relative w-full md:w-64">
      <label htmlFor="transaction-search" className="sr-only">Search transactions</label>
      <input
        id="transaction-search"
        type="text"
        placeholder="Search transactions"
        className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="absolute right-3 top-2.5 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}

interface TransactionsContainerProps {
  initialData: TransactionResponse;
}

// [CONCEPT: State Management at Client Boundary]
// This component encapsulates the filtering state and integrates with URL via searchParams.
// It uses SWR for client-side data fetching/caching while honoring initial RSC data.
export function TransactionsContainer({ initialData }: TransactionsContainerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || 'All Categories';
  const sort = searchParams.get('sort') || 'Latest';
  const page = searchParams.get('page') || '1';
  const pageNum = parseInt(page) || 1;
  
  const swrParams = new URLSearchParams({ query, category, sort, page: String(pageNum) });
  const { data, isLoading } = useSWR<TransactionResponse>(
    `/api/transactions?${swrParams.toString()}`,
    fetcher,
    { fallbackData: initialData }
  );

  const handleParamChange = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    params.set('page', '1');
    router.push(`/transactions?${params.toString()}`);
  }, [router, searchParams]);

  const transactions = data?.transactions || initialData.transactions;
  const hasMore = data?.hasMore ?? initialData.hasMore;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <DebouncedSearch
            key={query}
            initialValue={query}
            onSearch={(v) => handleParamChange('query', v)}
          />
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="hidden lg:block text-slate-500 text-sm">Sort by</label>
              <select 
                id="sort-select"
                aria-label="Sort transactions by"
                value={sort}
                onChange={(e) => handleParamChange('sort', e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="category-select" className="hidden lg:block text-slate-500 text-sm">Category</label>
              <select 
                id="category-select"
                aria-label="Filter transactions by category"
                value={category}
                onChange={(e) => handleParamChange('category', e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="All Categories">All Categories</option>
                {TRANSACTION_CATEGORIES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-sm">
                <th scope="col" className="pb-4 font-normal">Recipient / Sender</th>
                <th scope="col" className="pb-4 font-normal">Category</th>
                <th scope="col" className="pb-4 font-normal">Transaction Date</th>
                <th scope="col" className="pb-4 font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading && !data ? (
                <tr>
                   <td colSpan={4} className="py-8 text-center text-slate-400 italic">Loading transactions...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                   <td colSpan={4} className="py-8 text-center text-slate-400 italic">No transactions found.</td>
                </tr>
              ) : (
                transactions.map((t: Transaction) => (
                  <tr key={t.id} className="text-sm">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          src={t.avatar} 
                          alt={t.name}
                          width={32}
                          height={32}
                          className="h-8 w-8"
                          fallbackText={t.name.charAt(0)}
                        />
                        <span className="font-bold text-slate-900">{t.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-500">{t.category}</td>
                    <td className="py-4 text-slate-500">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</td>
                    <td className={`py-4 text-right font-bold ${t.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                      {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              aria-label="Previous page"
              disabled={pageNum <= 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', (pageNum - 1).toString());
                router.push(`/transactions?${params.toString()}`);
              }}
            >
              Prev
            </button>
            <button 
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              aria-label="Next page"
              disabled={!hasMore}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', (pageNum + 1).toString());
                router.push(`/transactions?${params.toString()}`);
              }}
            >
              Next
            </button>
          </div>
          <p className="text-sm text-slate-500">Page {pageNum}</p>
        </div>
      </div>
    </div>
  );
}
