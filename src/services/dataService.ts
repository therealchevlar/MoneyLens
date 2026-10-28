import {
  Account,
  Goal,
  RecurringObligation,
  Transaction,
  TransactionCategory,
} from '@/src/types/finance';
import {
  CURRENT_REFERENCE_DATE,
  INITIAL_ACCOUNT,
  INITIAL_GOALS,
  INITIAL_TRANSACTIONS,
  RECURRING_OBLIGATIONS,
} from '@/src/data/mockFinanceData';

const STORAGE_KEYS = {
  ACCOUNT: 'moneylens_account_v2',
  TRANSACTIONS: 'moneylens_transactions_v2',
  GOALS: 'moneylens_goals_v2',
  RECURRING: 'moneylens_recurring_v2',
  ONBOARDED: 'moneylens_onboarded_v2',
};

const DEFAULT_READY_ACCOUNT: Account = {
  id: 'acc_wallet_primary',
  name: 'Personal Cash Wallet',
  bankName: 'Personal Wallet',
  accountNumberMasked: 'WALLET •••• 3810',
  balance: 280000,
  currency: 'PKR',
  updatedAt: new Date().toISOString(),
  monthlySalary: 250000,
  salaryPayday: 1,
};

const DEFAULT_CLEAN_ACCOUNT: Account = {
  id: 'acc_wallet_primary',
  name: 'Personal Cash Wallet',
  bankName: 'Personal Wallet',
  accountNumberMasked: 'WALLET •••• 01',
  balance: 0,
  currency: 'PKR',
  updatedAt: new Date().toISOString(),
  monthlySalary: 0,
  salaryPayday: 1,
};

class DataService {
  private account: Account = { ...DEFAULT_READY_ACCOUNT };
  private transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
  private goals: Goal[] = [...INITIAL_GOALS];
  private recurring: RecurringObligation[] = [...RECURRING_OBLIGATIONS];
  private isOnboarded: boolean = true;
  private listeners: Set<() => void> = new Set();

  constructor() {
    let loaded = false;

    if (typeof window !== 'undefined') {
      try {
        const savedAcc = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
        const savedTxs = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
        const savedRec = localStorage.getItem(STORAGE_KEYS.RECURRING);

        if (savedAcc && savedTxs) {
          const parsedTxs = JSON.parse(savedTxs);
          // Only load if transactions exist; otherwise fall back to full initialized dataset
          if (Array.isArray(parsedTxs) && parsedTxs.length > 0) {
            this.account = JSON.parse(savedAcc);
            this.transactions = parsedTxs;
            this.goals = savedGoals ? JSON.parse(savedGoals) : [...INITIAL_GOALS];
            this.recurring = savedRec ? JSON.parse(savedRec) : [...RECURRING_OBLIGATIONS];
            this.isOnboarded = true;
            loaded = true;
          }
        }
      } catch (e) {
        console.error('Failed to parse saved wallet data:', e);
      }
    }

    if (!loaded) {
      // PRE-INITIALIZE ALL PRODUCTION VALUES READY TO LAUNCH
      this.isOnboarded = true;
      this.account = { ...DEFAULT_READY_ACCOUNT };
      this.transactions = [...INITIAL_TRANSACTIONS];
      this.goals = [...INITIAL_GOALS];
      this.recurring = [...RECURRING_OBLIGATIONS];
      this.persist();
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(this.account));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(this.goals));
      localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(this.recurring));
      localStorage.setItem(STORAGE_KEYS.ONBOARDED, this.isOnboarded ? 'true' : 'false');
    } catch (e) {
      console.error('Error saving wallet data to localStorage:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.persist();
    this.listeners.forEach((listener) => listener());
  }

  public getReferenceDate(): string {
    return CURRENT_REFERENCE_DATE;
  }

  public hasCompletedOnboarding(): boolean {
    return this.isOnboarded;
  }

  public completeOnboarding(config: {
    startingBalance: number;
    monthlySalary: number;
    salaryPayday: number;
    walletName?: string;
  }) {
    this.isOnboarded = true;
    this.account = {
      ...this.account,
      name: config.walletName || 'Personal Cash Wallet',
      bankName: 'Personal Wallet',
      accountNumberMasked: 'WALLET •••• 01',
      balance: config.startingBalance || 0,
      monthlySalary: config.monthlySalary || 0,
      salaryPayday: config.salaryPayday || 1,
      updatedAt: new Date().toISOString(),
    };

    // If starting balance is positive, log initial balance entry
    if (config.startingBalance > 0) {
      const initialTx: Transaction = {
        id: `tx_init_${Date.now()}`,
        date: CURRENT_REFERENCE_DATE,
        merchant: 'Initial Cash Deposit',
        description: 'Opening wallet cash balance',
        category: 'Salary',
        amount: config.startingBalance,
        type: 'income',
        status: 'cleared',
        accountId: this.account.id,
      };
      this.transactions = [initialTx];
    } else {
      this.transactions = [];
    }

    // Default safety reserve goal
    this.goals = [
      {
        id: 'goal_emergency_reserve',
        name: 'Emergency Reserve Fund',
        category: 'Safety',
        targetAmount: Math.max(100000, (config.monthlySalary || 100000) * 2),
        currentAmount: Math.min(config.startingBalance * 0.4, 50000),
        deadline: '2027-04-30',
        monthlyContribution: Math.round((config.monthlySalary || 100000) * 0.1),
        createdAt: CURRENT_REFERENCE_DATE,
        color: '#10b981',
      },
    ];

    this.notify();
  }

  public getAccount(): Account {
    return { ...this.account };
  }

  public getTransactions(): Transaction[] {
    return [...this.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  public getGoals(): Goal[] {
    return [...this.goals];
  }

  public getRecurringObligations(): RecurringObligation[] {
    return [...this.recurring];
  }

  /**
   * Quick Add Income Deposit
   */
  public addIncome(params: {
    title: string;
    amount: number;
    category?: TransactionCategory;
    date?: string;
    note?: string;
  }): Transaction {
    const newTx: Transaction = {
      id: `tx_inc_${Date.now()}`,
      date: params.date || CURRENT_REFERENCE_DATE,
      merchant: params.title.trim(),
      description: params.note || 'Cash / Deposit Inflow',
      category: params.category || 'Salary',
      amount: Math.abs(params.amount),
      type: 'income',
      status: 'cleared',
      accountId: this.account.id,
    };

    this.transactions.unshift(newTx);
    this.account.balance += newTx.amount;
    this.account.updatedAt = new Date().toISOString();
    this.notify();
    return newTx;
  }

  /**
   * Quick Add Expense Deduction
   */
  public addExpense(params: {
    title: string;
    amount: number;
    category?: TransactionCategory;
    date?: string;
    isRecurring?: boolean;
    recurringDay?: number;
    note?: string;
  }): Transaction {
    const amount = Math.abs(params.amount);
    const dateStr = params.date || CURRENT_REFERENCE_DATE;
    const cat = params.category || 'Miscellaneous';

    const newTx: Transaction = {
      id: `tx_exp_${Date.now()}`,
      date: dateStr,
      merchant: params.title.trim(),
      description: params.note || `${cat} expense entry`,
      category: cat,
      amount,
      type: 'expense',
      status: 'cleared',
      isRecurring: params.isRecurring || false,
      accountId: this.account.id,
    };

    this.transactions.unshift(newTx);
    this.account.balance -= amount;
    this.account.updatedAt = new Date().toISOString();

    // If recurring toggle was active, also register as recurring obligation
    if (params.isRecurring) {
      const day = params.recurringDay || new Date(dateStr).getDate() || 1;
      const recItem: RecurringObligation = {
        id: `rec_${Date.now()}`,
        name: params.title.trim(),
        category: cat,
        amount,
        frequency: 'monthly',
        dayOfMonth: day,
        lastBilledDate: dateStr,
        nextDueDate: `2026-10-${day.toString().padStart(2, '0')}`,
        active: true,
        merchant: params.title.trim(),
      };
      this.recurring.push(recItem);
    }

    this.notify();
    return newTx;
  }

  public updateMonthlySalary(salary: number, payday: number = 1) {
    this.account.monthlySalary = Math.max(0, salary);
    this.account.salaryPayday = Math.max(1, Math.min(31, payday));
    this.account.updatedAt = new Date().toISOString();
    this.notify();
  }

  public deleteTransaction(id: string): boolean {
    const tx = this.transactions.find((t) => t.id === id);
    if (!tx) return false;

    // Reverse the balance impact
    if (tx.type === 'expense') {
      this.account.balance += tx.amount;
    } else if (tx.type === 'income') {
      this.account.balance -= tx.amount;
    }

    this.transactions = this.transactions.filter((t) => t.id !== id);
    this.account.updatedAt = new Date().toISOString();
    this.notify();
    return true;
  }

  public addRecurringObligation(obligation: Omit<RecurringObligation, 'id'>): RecurringObligation {
    const newRec: RecurringObligation = {
      ...obligation,
      id: `rec_${Date.now()}`,
    };
    this.recurring.push(newRec);
    this.notify();
    return newRec;
  }

  public deleteRecurringObligation(id: string): boolean {
    const prev = this.recurring.length;
    this.recurring = this.recurring.filter((r) => r.id !== id);
    const deleted = this.recurring.length < prev;
    if (deleted) this.notify();
    return deleted;
  }

  public addGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.goals.push(newGoal);
    this.notify();
    return newGoal;
  }

  public updateGoal(id: string, updates: Partial<Goal>): Goal | null {
    const idx = this.goals.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    this.goals[idx] = { ...this.goals[idx], ...updates };
    this.notify();
    return this.goals[idx];
  }

  public deleteGoal(id: string): boolean {
    const prevLen = this.goals.length;
    this.goals = this.goals.filter((g) => g.id !== id);
    const deleted = this.goals.length < prevLen;
    if (deleted) this.notify();
    return deleted;
  }

  /**
   * Reset to zero-balance fresh wallet (for clean re-configuration)
   */
  public resetToFreshWallet() {
    this.isOnboarded = false;
    this.account = { ...DEFAULT_CLEAN_ACCOUNT };
    this.transactions = [];
    this.goals = [];
    this.recurring = [];
    this.notify();
  }

  /**
   * Option to load sample template data
   */
  public loadSampleData() {
    this.isOnboarded = true;
    this.account = {
      ...INITIAL_ACCOUNT,
      name: 'Personal Cash Wallet',
      bankName: 'Personal Wallet',
      accountNumberMasked: 'WALLET •••• 01',
      monthlySalary: 250000,
      salaryPayday: 1,
    };
    this.transactions = [...INITIAL_TRANSACTIONS];
    this.goals = [...INITIAL_GOALS];
    this.recurring = [...RECURRING_OBLIGATIONS];
    this.notify();
  }
}

export const dataService = new DataService();
