import type { Transaction, Budget, Pot, Bill, Balance } from './data';

class MockDatabase {
  private initialTransactions: Transaction[] = [
    { id: '1', name: 'Emma Richardson', category: 'General', date: '2024-08-19', amount: 75.50, avatar: '/avatars/emma-richardson.jpg' },
    { id: '2', name: 'Savory Bites Bistro', category: 'Dining Out', date: '2024-08-19', amount: -55.50, avatar: '/avatars/savory-bites-bistro.jpg' },
    { id: '3', name: 'Daniel Carter', category: 'General', date: '2024-08-18', amount: -40.00, avatar: '/avatars/daniel-carter.jpg' },
    { id: '4', name: 'Sunnyside Aubergine', category: 'Dining Out', date: '2024-08-17', amount: 15.00, avatar: '/avatars/sunnyside-aubergine.jpg' },
    { id: '5', name: 'Urban Services', category: 'General', date: '2024-08-17', amount: -25.00, avatar: '/avatars/urban-services.jpg' },
    { id: '6', name: 'Liam Hughes', category: 'Groceries', date: '2024-08-15', amount: 200.00, avatar: '/avatars/liam-hughes.jpg' },
    { id: '7', name: 'Lily Thompson', category: 'General', date: '2024-08-15', amount: -15.00, avatar: '/avatars/lily-thompson.jpg' },
    { id: '8', name: 'James Dixon', category: 'Entertainment', date: '2024-08-14', amount: -120.00, avatar: '/avatars/james-dixon.jpg' },
    { id: '9', name: 'Sebastian Cook', category: 'Transportation', date: '2024-08-14', amount: -35.00, avatar: '/avatars/sebastian-cook.jpg' },
    { id: '10', name: 'Olivia Miller', category: 'Personal Care', date: '2024-08-13', amount: 50.00, avatar: '/avatars/olivia-miller.jpg' },
  ];

  private initialBalance: Balance = {
    current: 4836.00,
    income: 3814.25,
    expenses: 1700.50,
  };

  private transactions: Transaction[] = [...this.initialTransactions];

  private budgets: Budget[] = [
    { id: '1', category: 'Entertainment', maximum: 50.00, spent: 15.00, color: '#277C78' },
    { id: '2', category: 'Bills', maximum: 750.00, spent: 150.00, color: '#82C9D7' },
    { id: '3', category: 'Dining Out', maximum: 75.00, spent: 40.00, color: '#F2CDAC' },
    { id: '4', category: 'Personal Care', maximum: 100.00, spent: 25.00, color: '#626070' },
  ];

  private pots: Pot[] = [
    { id: '1', name: 'Savings', target: 2000.00, total: 159.00, color: '#277C78' },
    { id: '2', name: 'Concert Tickets', target: 150.00, total: 110.00, color: '#626070' },
    { id: '3', name: 'Gift', target: 150.00, total: 40.00, color: '#82C9D7' },
    { id: '4', name: 'New Laptop', target: 1000.00, total: 10.00, color: '#F2CDAC' },
  ];

  private bills: Bill[] = [
    { id: '1', name: 'Spark Electric', amount: 100.00, dueDate: 'Monthly-02nd', isPaid: true },
    { id: '2', name: 'Serenity Spa', amount: 25.00, dueDate: 'Monthly-03rd', isPaid: true },
    { id: '3', name: 'Health-conscious', amount: 15.00, dueDate: 'Monthly-11th', isPaid: false },
    { id: '4', name: 'Pixel Playground', amount: 10.00, dueDate: 'Monthly-11th', isPaid: false },
    { id: '5', name: 'Elevate Education', amount: 50.00, dueDate: 'Monthly-15th', isPaid: false },
    { id: '6', name: 'Archive Antiques', amount: 10.00, dueDate: 'Monthly-26th', isPaid: false },
    { id: '7', name: 'Swift Savings', amount: 500.00, dueDate: 'Monthly-26th', isPaid: false },
  ];

  private balance: Balance = { ...this.initialBalance };

  getTransactions() {
    return [...this.transactions];
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'date'>) {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
    };
    this.transactions.unshift(newTransaction);
    
    // Update balance
    this.balance.current += transaction.amount;
    if (transaction.amount > 0) {
      this.balance.income += transaction.amount;
    } else {
      this.balance.expenses += Math.abs(transaction.amount);
    }
    
    return newTransaction;
  }

  deleteTransaction(id: string): boolean {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      const t = this.transactions[index];
      this.balance.current -= t.amount;
      if (t.amount > 0) {
        this.balance.income -= t.amount;
      } else {
        this.balance.expenses -= Math.abs(t.amount);
      }
      this.transactions.splice(index, 1);
      return true;
    }
    return false;
  }

  getBudgets() {
    return [...this.budgets];
  }

  getPots() {
    return [...this.pots];
  }

  getBills() {
    return [...this.bills];
  }

  getBalance() {
    return { ...this.balance };
  }

  reset() {
    this.transactions = [...this.initialTransactions];
    this.balance = { ...this.initialBalance };
  }
}

// Singleton instance
export const mockDb = new MockDatabase();
