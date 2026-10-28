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
  ACCOUNT: 'moneylens_v3_account',
  TRANSACTIONS: 'moneylens_v3_transactions',
  GOALS: 'moneylens_v3_goals',
  RECURRING: 'moneylens_v3_recurring',
  ONBOARDED: 'moneylens_v3_onboarded',
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
  private account: Account = { ...DEFAULT_CLEAN_ACCOUNT };
  private transactions: Transaction[] = [];
  private goals: Goal[] = [];
  private recurring: RecurringObligation[] = [];
  private isOnboarded: boolean = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    let loaded = false;

    if (typeof window !== 'undefined') {
      try {
        const onboarded = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
        const savedAcc = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
        const savedTxs = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
        const savedRec = localStorage.getItem(STORAGE_KEYS.RECURRING);

        if (onboarded === 'true' && savedAcc) {
          this.account = JSON.parse(savedAcc);
          this.transactions = savedTxs ? JSON.parse(savedTxs) : [];
          this.goals = savedGoals ? JSON.parse(savedGoals) : [];
          this.recurring = savedRec ? JSON.parse(savedRec) : [];
          this.isOnboarded = true;
          loaded = true;
        }
      } catch (e) {
        console.error('Failed to parse saved wallet data:', e);
      }
    }

    if (!loaded) {
      // READY TO SHIP: ZERO DEMO TRANSACTIONS / ZERO DEMO DATA OUT OF THE BOX
      this.isOnboarded = false;
      this.account = { ...DEFAULT_CLEAN_ACCOUNT };
      this.transactions = [];
      this.goals = [];
      this.recurring = [];
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
    return new Date().toISOString().split('T')[0];
  }

  public hasCompletedOnboarding(): boolean {
    return this.isOnboarded;
  }

  public completeOnboarding(config: {
    startingBalance: number;
    monthlySalary: number;
    salaryPayday: number;
    walletName?: string;
    currency?: string;
    initialGoal?: {
      name: string;
      category: string;
      targetAmount: number;
      deadline: string;
      monthlyContribution: number;
    };
  }) {
    this.isOnboarded = true;
    const refDate = this.getReferenceDate();
    const curr = (config.currency || 'PKR') as any;

    this.account = {
      ...this.account,
      name: config.walletName?.trim() || 'Personal Cash Wallet',
      bankName: 'Personal Wallet',
      accountNumberMasked: `WALLET •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: Math.max(0, config.startingBalance || 0),
      monthlySalary: Math.max(0, config.monthlySalary || 0),
      salaryPayday: config.salaryPayday || 1,
      currency: curr,
      updatedAt: new Date().toISOString(),
    };

    // If starting balance is positive, log single opening cash deposit
    if (config.startingBalance > 0) {
      const initialTx: Transaction = {
        id: `tx_init_${Date.now()}`,
        date: refDate,
        merchant: 'Opening Cash Balance',
        description: 'Opening wallet funds recorded during setup',
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

    // If user defined an initial goal during setup
    if (config.initialGoal && config.initialGoal.targetAmount > 0) {
      this.goals = [
        {
          id: `goal_${Date.now()}`,
          name: config.initialGoal.name,
          category: config.initialGoal.category || 'Safety',
          targetAmount: config.initialGoal.targetAmount,
          currentAmount: Math.min(config.startingBalance * 0.25, config.initialGoal.targetAmount * 0.25),
          deadline: config.initialGoal.deadline || '2027-04-30',
          monthlyContribution: config.initialGoal.monthlyContribution || Math.round(config.initialGoal.targetAmount / 12),
          createdAt: refDate,
          color: '#10b981',
        },
      ];
    } else {
      this.goals = [];
    }

    this.recurring = [];
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
