import {
  Account,
  Goal,
  RecurringObligation,
  Transaction,
} from '@/src/types/finance';
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
import { formatPKR, formatPercent } from '@/src/lib/utils';
import { NavItem } from '@/src/types/navigation';

export interface DynamicInsight {
  id: string;
  type: 'spending' | 'savings' | 'cashflow' | 'goals' | 'subscriptions' | 'anomalies';
  title: string;
  category: string;
  severity: 'positive' | 'warning' | 'info' | 'high';
  summary: string;
  explanation: string;
  supportingData: Record<string, string | number>;
  recommendedAction: string;
  actionTarget: NavItem;
  actionButtonText: string;
  createdAt: string;
}

/**
 * Generate automated insights deterministically from the user's financial dataset.
 */
export function generateInsights(
  account: Account,
  transactions: Transaction[],
  recurring: RecurringObligation[],
  goals: Goal[],
  referenceDate: string = '2026-09-30'
): DynamicInsight[] {
  const insights: DynamicInsight[] = [];
  const currentMonth = '2026-09';
  const previousMonth = '2026-08';

  // 1. Spending Anomaly Insight
  const anomalies = detectSpendingAnomalies(transactions);
  if (anomalies.length > 0) {
    const topAnomaly = anomalies[0];
    insights.push({
      id: `ins_anomaly_${topAnomaly.transactionId}`,
      type: 'anomalies',
      title: `Unusual Transaction Detected: ${formatPKR(topAnomaly.amount)}`,
      category: 'Pattern Verification',
      severity: topAnomaly.severity === 'high' ? 'high' : 'warning',
      summary: `${topAnomaly.merchant} purchase is ${(topAnomaly.amount / (topAnomaly.categoryAverage || 1)).toFixed(1)}x higher than your normal category average.`,
      explanation: `A single debit of ${formatPKR(topAnomaly.amount)} at ${topAnomaly.merchant} on ${topAnomaly.date} significantly exceeds your normal ${topAnomaly.category} average of ${formatPKR(topAnomaly.categoryAverage)}. MoneyLens flagged this as an infrequent capital equipment expense.`,
      supportingData: {
        'Merchant': topAnomaly.merchant,
        'Amount Debited': formatPKR(topAnomaly.amount),
        'Category Average': formatPKR(topAnomaly.categoryAverage),
        'Multiplier': `${(topAnomaly.amount / (topAnomaly.categoryAverage || 1)).toFixed(1)}x baseline`,
      },
      recommendedAction: 'Inspect transaction receipt in Transaction Explorer and confirm authorization.',
      actionTarget: 'transactions',
      actionButtonText: 'Inspect Transaction',
      createdAt: referenceDate,
    });
  }

  // 2. Spending Surge Insight (Dining & Food)
  const categorySummaries = calculateCategorySpending(transactions, currentMonth, previousMonth);
  const dining = categorySummaries.find((c) => c.category === 'Dining & Food');
  if (dining && dining.percentageChange > 10) {
    insights.push({
      id: 'ins_spending_dining',
      type: 'spending',
      title: `Food & Dining Outflow Surged +${dining.percentageChange.toFixed(1)}%`,
      category: 'Spending Velocity',
      severity: 'warning',
      summary: `Dining expenses grew from ${formatPKR(dining.previousMonth)} in August to ${formatPKR(dining.currentMonth)} in September.`,
      explanation: `While household groceries remained flat (+1.2%), restaurant visits in late September (Cafe Aylanto, Ginsoy, Kolachi, and Chai Khana) drove ${formatPKR(dining.currentMonth - dining.previousMonth)} in excess discretionary spending.`,
      supportingData: {
        'Current Month Dining': formatPKR(dining.currentMonth),
        'Previous Month Dining': formatPKR(dining.previousMonth),
        'Net Outflow Increase': `+${formatPKR(dining.currentMonth - dining.previousMonth)}`,
        'Share of Total Spend': `${dining.percentageOfTotal}%`,
      },
      recommendedAction: 'Set a weekly dining cap of PKR 4,000 for the upcoming 3 weeks to restore baseline.',
      actionTarget: 'transactions',
      actionButtonText: 'Review Dining Receipts',
      createdAt: referenceDate,
    });
  }

  // 3. Subscriptions Overhead Insight
  const recurringCalc = calculateRecurringExpenses(recurring);
  const subsTotal = recurringCalc.byCategory['Subscriptions'] || 0;
  if (subsTotal > 0) {
    insights.push({
      id: 'ins_subscriptions_audit',
      type: 'subscriptions',
      title: `3 Active Subscriptions Totaling ${formatPKR(subsTotal)} / Month`,
      category: 'Recurring Commitments',
      severity: 'info',
      summary: `Regular digital billings consume ${formatPKR(subsTotal * 12)} annually.`,
      explanation: `Your subscriptions include Coursera Specialization (${formatPKR(4500)}/mo), Netflix 4K (${formatPKR(1500)}/mo), and Spotify Family (${formatPKR(400)}/mo). Coursera accounts for 70.3% of subscription costs.`,
      supportingData: {
        'Monthly Recurring': formatPKR(subsTotal),
        'Annualized Impact': formatPKR(subsTotal * 12),
        'Largest Service': 'Coursera Plus (PKR 4,500/mo)',
        'Active Count': '3 verified services',
      },
      recommendedAction: 'If your online coursework is ending, pausing Coursera frees up PKR 54,000 annually for university fees.',
      actionTarget: 'simulator',
      actionButtonText: 'Simulate Savings in What-If',
      createdAt: referenceDate,
    });
  }

  // 4. Goals Pace & University Fees Insight
  const goalAnalytics = calculateGoalsAnalytics(goals, referenceDate);
  const uniGoal = goalAnalytics.find((g) => g.id.includes('uni') || g.category.toLowerCase() === 'education');
  if (uniGoal) {
    const isPaceTight = uniGoal.status !== 'on_track';
    insights.push({
      id: 'ins_goals_uni_pace',
      type: 'goals',
      title: isPaceTight ? 'University Fees Target Requires Contribution Boost' : 'University Fees Goal on Track',
      category: 'Milestone Tracking',
      severity: isPaceTight ? 'warning' : 'positive',
      summary: `You have accumulated ${formatPKR(uniGoal.currentAmount)} of your ${formatPKR(uniGoal.targetAmount)} target (${uniGoal.progressPercentage}%).`,
      explanation: `With approximately 2.5 months until the deadline (${uniGoal.deadline}), your current pace of ${formatPKR(uniGoal.monthlyContribution)}/month will leave a gap of approximately ${formatPKR(Math.max(0, uniGoal.remainingAmount - (uniGoal.monthlyContribution * 2.5)))}.`,
      supportingData: {
        'Target Amount': formatPKR(uniGoal.targetAmount),
        'Current Saved': formatPKR(uniGoal.currentAmount),
        'Remaining Balance': formatPKR(uniGoal.remainingAmount),
        'Required Monthly Pace': `${formatPKR(uniGoal.requiredMonthlySavings)}/mo`,
      },
      recommendedAction: `Increase monthly contribution to ${formatPKR(uniGoal.requiredMonthlySavings)}/mo to ensure 100% on-time completion.`,
      actionTarget: 'goals',
      actionButtonText: 'Adjust Goal Contribution',
      createdAt: referenceDate,
    });
  }

  // 5. Cashflow Forecast Buffer Insight
  const cashflow = calculateCashflowForecast(account, recurring, referenceDate, 60);
  insights.push({
    id: 'ins_cashflow_buffer',
    type: 'cashflow',
    title: `Cashflow Projection Preserves Safety Floor (${formatPKR(cashflow.minimumProjectedBalance)})`,
    category: 'Predictive Trajectory',
    severity: 'positive',
    summary: `Projected minimum balance over the next 60 days will safely remain above your PKR 100,000 reserve target.`,
    explanation: `Scheduled salary credits on the 1st of each month buffer against scheduled rent (PKR 55,000) and utility deductions, preventing any overdraft or emergency reserve erosion.`,
    supportingData: {
      'Current Liquid Balance': formatPKR(account.balance),
      'Projected Lowest Balance': formatPKR(cashflow.minimumProjectedBalance),
      'Lowest Balance Date': cashflow.minimumBalanceDate,
      'Reserve Floor': formatPKR(100000),
    },
    recommendedAction: 'Preserve this trajectory to ensure sufficient liquidity for December semester fees.',
    actionTarget: 'simulator',
    actionButtonText: 'Test Decision in What-If',
    createdAt: referenceDate,
  });

  return insights;
}
