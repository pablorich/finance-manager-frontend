import { mockDb } from './mock-db';

/**
 * Simulates a randomized delay to mimic real-world network latency.
 * @param min Minimum delay in milliseconds
 * @param max Maximum delay in milliseconds
 */
export const delay = (min: number = 500, max: number = 1500) => {
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

export interface Budget {
  id: string;
  category: string;
  maximum: number;
  spent: number;
  color: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

export interface Pot {
  id: string;
  name: string;
  target: number;
  total: number;
  color: string;
  theme?: string;
}

export interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  avatar: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  totalCount: number;
  hasMore: boolean;
}

export const getBalance = async (): Promise<Balance> => {
  await delay();
  return mockDb.getBalance();
};

export const getBudgets = async (): Promise<Budget[]> => {
  await delay();
  return mockDb.getBudgets();
};

export const getUserSettings = async () => {
  await delay(200, 500); // Faster fetch for settings
  return {
    currency: 'USD',
    theme: 'light',
    budgetExceededAlert: true,
  };
};

export const getBudgetsWithSettings = async (settings: { currency: string; theme: string; budgetExceededAlert: boolean }): Promise<Budget[]> => {
  // Simulate logic dependent on settings
  console.log(`Fetching budgets using currency: ${settings.currency}`);
  await delay();
  return mockDb.getBudgets();
};

export const getRecurringBills = async (): Promise<Bill[]> => {
  await delay();
  return mockDb.getBills();
};

export const getPots = async (): Promise<Pot[]> => {
  await delay();
  return mockDb.getPots();
};

export const getTransactions = async (
  query: string = '', 
  page: number = 1,
  category: string = 'All Categories',
  sort: string = 'Latest'
): Promise<TransactionResponse> => {
  await delay();
  const allTransactions = mockDb.getTransactions();

  let filtered = [...allTransactions];
  
  // Filter by search query
  if (query) {
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(query.toLowerCase()) || 
      t.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filter by category
  if (category !== 'All Categories') {
    filtered = filtered.filter(t => t.category === category);
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sort) {
      case 'Oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'Highest':
        return b.amount - a.amount;
      case 'Lowest':
        return a.amount - b.amount;
      case 'Latest':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const pageSize = 10;
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const transactions = filtered.slice(start, start + pageSize);
  const totalCount = filtered.length;
  const hasMore = start + pageSize < totalCount;

  return {
    transactions,
    totalCount,
    hasMore
  };
};

// Compatibility export for origin/main calls
export const getBills = getRecurringBills;
export const getOverviewData = async () => {
  const [balance, transData, budgets, pots] = await Promise.all([
    getBalance(),
    getTransactions(),
    getBudgets(),
    getPots()
  ]);
  return { balance, transactions: transData.transactions, budgets, pots };
};
