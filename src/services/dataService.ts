import {
  Account,
  Goal,
  RecurringObligation,
  Transaction,
} from '@/src/types/finance';
import {
  CURRENT_REFERENCE_DATE,
  INITIAL_ACCOUNT,
  INITIAL_GOALS,
  INITIAL_TRANSACTIONS,
  RECURRING_OBLIGATIONS,
} from '@/src/data/mockFinanceData';

class DataService {
  private account: Account = { ...INITIAL_ACCOUNT };
  private transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
  private goals: Goal[] = [...INITIAL_GOALS];
  private recurring: RecurringObligation[] = [...RECURRING_OBLIGATIONS];
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public getReferenceDate(): string {
    return CURRENT_REFERENCE_DATE;
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

  public addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    const newTx: Transaction = {
      ...transaction,
      id: `tx_${Date.now()}`,
    };
    this.transactions.unshift(newTx);
    if (newTx.type === 'expense') {
      this.account.balance -= newTx.amount;
    } else if (newTx.type === 'income') {
      this.account.balance += newTx.amount;
    }
    this.notify();
    return newTx;
  }

  public resetDemoData() {
    this.account = { ...INITIAL_ACCOUNT };
    this.transactions = [...INITIAL_TRANSACTIONS];
    this.goals = [...INITIAL_GOALS];
    this.recurring = [...RECURRING_OBLIGATIONS];
    this.notify();
  }
}

export const dataService = new DataService();
