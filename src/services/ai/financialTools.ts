import { dataService } from '@/src/services/dataService';
import {
  calculateCategorySpending,
  calculateFinancialHealth,
  calculateGoalsAnalytics,
  calculateMonthlyTotals,
  calculateRecurringExpenses,
  calculateSavingsRate,
  detectSpendingAnomalies,
  calculateCashflowForecast,
} from '@/src/services/finance/financeEngine';
import {
  simulatePurchase,
  simulateRecurringExpenseChange,
  simulateIncomeChange,
  simulateSavingsIncrease,
} from '@/src/services/simulator/simulationEngine';

export interface ToolExecutionRecord {
  toolName: string;
  arguments: Record<string, any>;
  result: any;
  statusText: string;
}

/**
 * Standard Financial Tool Registry
 * Strictly delegates to deterministic calculations and data repositories.
 */
export const financialTools = {
  getAccountSummary: () => {
    const acc = dataService.getAccount();
    const totals = calculateMonthlyTotals(dataService.getTransactions(), '2026-09');
    return {
      accountId: acc.id,
      bank: acc.bankName,
      accountNumber: acc.accountNumberMasked,
      currentBalance: acc.balance,
      currency: acc.currency,
      septemberIncome: totals.income,
      septemberExpenses: totals.expense,
      netSavings: totals.netSavings,
    };
  },

  getTransactions: (args: { category?: string; month?: string; limit?: number } = {}) => {
    let txs = dataService.getTransactions();
    if (args.category && args.category !== 'all') {
      txs = txs.filter((t) => t.category.toLowerCase() === args.category?.toLowerCase());
    }
    if (args.month && args.month !== 'all') {
      txs = txs.filter((t) => t.date.startsWith(args.month!));
    }
    return txs.slice(0, args.limit || 20);
  },

  getSpendingByCategory: (args: { currentMonth?: string; previousMonth?: string } = {}) => {
    const cur = args.currentMonth || '2026-09';
    const prev = args.previousMonth || '2026-08';
    return calculateCategorySpending(dataService.getTransactions(), cur, prev);
  },

  getIncomeHistory: () => {
    const txs = dataService.getTransactions().filter((t) => t.type === 'income');
    return txs.map((t) => ({
      date: t.date,
      merchant: t.merchant,
      amount: t.amount,
      category: t.category,
      description: t.description,
    }));
  },

  getRecurringExpenses: () => {
    const rec = dataService.getRecurringObligations();
    return calculateRecurringExpenses(rec);
  },

  getUpcomingObligations: () => {
    const rec = dataService.getRecurringObligations();
    return rec
      .filter((r) => r.active)
      .map((r) => ({
        name: r.name,
        merchant: r.merchant,
        amount: r.amount,
        category: r.category,
        dayOfMonth: r.dayOfMonth,
        nextDueDate: r.nextDueDate,
      }));
  },

  getCashflowForecast: (args: { daysAhead?: number } = {}) => {
    const acc = dataService.getAccount();
    const rec = dataService.getRecurringObligations();
    return calculateCashflowForecast(acc, rec, dataService.getReferenceDate(), args.daysAhead || 60);
  },

  getFinancialGoals: () => {
    const goals = dataService.getGoals();
    return calculateGoalsAnalytics(goals, dataService.getReferenceDate());
  },

  calculateFinancialHealth: () => {
    const acc = dataService.getAccount();
    const txs = dataService.getTransactions();
    const rec = dataService.getRecurringObligations();
    const goals = dataService.getGoals();
    return calculateFinancialHealth(acc, txs, rec, goals, '2026-09');
  },

  detectAnomalies: () => {
    const txs = dataService.getTransactions();
    return detectSpendingAnomalies(txs);
  },

  simulatePurchase: (args: { amount: number; itemName: string; dayOffset?: number }) => {
    const acc = dataService.getAccount();
    const rec = dataService.getRecurringObligations();
    const goals = dataService.getGoals();
    return simulatePurchase(
      acc,
      rec,
      goals,
      args.amount,
      args.itemName || 'Requested Item',
      args.dayOffset || 3,
      dataService.getReferenceDate()
    );
  },

  simulateExpenseChange: (args: { monthlyDelta: number; description: string }) => {
    const acc = dataService.getAccount();
    const rec = dataService.getRecurringObligations();
    const goals = dataService.getGoals();
    return simulateRecurringExpenseChange(
      acc,
      rec,
      goals,
      args.monthlyDelta,
      args.description || 'Monthly Commitment Adjustment',
      dataService.getReferenceDate()
    );
  },

  simulateIncomeChange: (args: { percentageChange: number }) => {
    const acc = dataService.getAccount();
    const rec = dataService.getRecurringObligations();
    const goals = dataService.getGoals();
    return simulateIncomeChange(
      acc,
      rec,
      goals,
      args.percentageChange,
      dataService.getReferenceDate()
    );
  },

  simulateSavingsChange: (args: { additionalMonthly: number }) => {
    const acc = dataService.getAccount();
    const rec = dataService.getRecurringObligations();
    const goals = dataService.getGoals();
    return simulateSavingsIncrease(
      acc,
      rec,
      goals,
      args.additionalMonthly,
      dataService.getReferenceDate()
    );
  },
};
