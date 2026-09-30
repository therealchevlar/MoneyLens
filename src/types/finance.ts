export type TransactionType = 'income' | 'expense' | 'transfer';

export type TransactionCategory =
  | 'Salary'
  | 'Freelance'
  | 'Rent'
  | 'Utilities'
  | 'Groceries'
  | 'Dining & Food'
  | 'Transport & Fuel'
  | 'Subscriptions'
  | 'Shopping'
  | 'Education'
  | 'Healthcare'
  | 'Entertainment'
  | 'Miscellaneous';

export interface Transaction {
  id: string;
  date: string; // ISO date 'YYYY-MM-DD'
  merchant: string;
  description: string;
  category: TransactionCategory;
  amount: number; // Positive number, PKR
  type: TransactionType;
  status: 'cleared' | 'pending';
  isRecurring?: boolean;
  isUnusual?: boolean;
  unusualReason?: string;
  accountId: string;
}

export interface Account {
  id: string;
  name: string;
  bankName: string;
  accountNumberMasked: string;
  balance: number;
  currency: 'PKR';
  updatedAt: string;
}

export interface Goal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // 'YYYY-MM-DD'
  monthlyContribution: number;
  createdAt: string;
  color?: string;
}

export interface RecurringObligation {
  id: string;
  name: string;
  category: TransactionCategory;
  amount: number;
  frequency: 'monthly' | 'yearly';
  dayOfMonth: number;
  lastBilledDate: string;
  nextDueDate: string;
  active: boolean;
  merchant: string;
}

export interface CashFlowPoint {
  date: string;
  balance: number;
  isProjected: boolean;
  income: number;
  expense: number;
  eventDescription?: string;
}

export interface SpendingAnomaly {
  transactionId: string;
  merchant: string;
  amount: number;
  date: string;
  category: TransactionCategory;
  categoryAverage: number;
  severity: 'low' | 'medium' | 'high';
  reason: string;
}

export type HealthScoreDimension =
  | 'Savings Rate'
  | 'Cash Flow Stability'
  | 'Emergency Reserve'
  | 'Spending Volatility'
  | 'Recurring Obligations'
  | 'Income Stability';

export interface HealthScoreBreakdownItem {
  dimension: HealthScoreDimension;
  score: number; // 0-100
  weight: number; // sum to 1.0
  contribution: number; // score * weight
  status: 'excellent' | 'good' | 'fair' | 'needs_attention';
  detail: string;
}

export interface FinancialHealthScore {
  totalScore: number; // 0-100
  previousMonthScore: number;
  change: number; // e.g. +6
  rating: 'Excellent' | 'Good' | 'Fair' | 'Vulnerable';
  breakdown: HealthScoreBreakdownItem[];
  explanation: string;
}

export interface CategorySpendingSummary {
  category: TransactionCategory;
  currentMonth: number;
  previousMonth: number;
  percentageChange: number;
  transactionCount: number;
  percentageOfTotal: number;
}
