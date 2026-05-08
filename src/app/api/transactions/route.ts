import { NextResponse } from 'next/server';
import { getTransactions } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || 'All Categories';
  const sort = searchParams.get('sort') || 'Latest';
  const page = parseInt(searchParams.get('page') || '1') || 1;

  try {
    const transactions = await getTransactions(query, page, category, sort);
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
