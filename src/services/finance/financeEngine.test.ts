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
  INITIAL_ACCOUNT,
  INITIAL_GOALS,
  INITIAL_TRANSACTIONS,
  RECURRING_OBLIGATIONS,
} from '@/src/data/mockFinanceData';

export function runFinancialEngineTests(): {
  total: number;
  passed: number;
  results: { name: string; passed: boolean; message: string }[];
} {
  const results: { name: string; passed: boolean; message: string }[] = [];

  function assert(name: string, condition: boolean, message: string) {
    results.push({
      name,
      passed: condition,
      message: condition ? `PASSED: ${message}` : `FAILED: ${message}`,
    });
  }

  // 1. Savings Rate Test
  const sepSavingsRate = calculateSavingsRate(INITIAL_TRANSACTIONS, '2026-09');
  assert(
    'Savings Rate Calculation',
    sepSavingsRate > 0 && sepSavingsRate <= 50,
    `September savings rate is ${sepSavingsRate}% (expected positive viable rate)`
  );

  // 2. Category Spending & Food Increase Test
  const catSpending = calculateCategorySpending(INITIAL_TRANSACTIONS, '2026-09', '2026-08');
  const foodCat = catSpending.find((c) => c.category === 'Dining & Food');
  assert(
    'Food Spending Increase Verification',
    foodCat !== undefined && foodCat.percentageChange > 15 && foodCat.percentageChange < 22,
    `Food spending changed by ${foodCat?.percentageChange}% (matches expected ~18% benchmark surge)`
  );

  // 3. Recurring Subscriptions Verification
  const recurringCalc = calculateRecurringExpenses(RECURRING_OBLIGATIONS);
  const subsTotal = recurringCalc.byCategory['Subscriptions'] || 0;
  assert(
    'Subscription Expenses Total',
    subsTotal === 6400,
    `Recurring subscriptions total PKR ${subsTotal.toLocaleString()} (expected exactly PKR 6,400: Netflix 1500 + Spotify 400 + Coursera 4500)`
  );

  // 4. Anomaly Detection Test
  const anomalies = detectSpendingAnomalies(INITIAL_TRANSACTIONS);
  const hafeezAnomaly = anomalies.find((a) => a.merchant.includes('Hafeez Center'));
  assert(
    'Hafeez Center Anomaly Flagged',
    hafeezAnomaly !== undefined && hafeezAnomaly.amount === 48000,
    `Detected unusual transaction at Hafeez Center for PKR ${hafeezAnomaly?.amount.toLocaleString()}`
  );

  // 5. Goal Analytics Test
  const goalsAnalytics = calculateGoalsAnalytics(INITIAL_GOALS, '2026-09-30');
  const uniGoal = goalsAnalytics.find((g) => g.id.includes('uni'));
  assert(
    'University Fee Goal Pace',
    uniGoal !== undefined && uniGoal.progressPercentage === 42 && uniGoal.remainingAmount === 116000,
    `University Goal is at ${uniGoal?.progressPercentage}% (PKR ${uniGoal?.remainingAmount.toLocaleString()} remaining)`
  );

  // 6. Financial Health Score Test
  const healthScore = calculateFinancialHealth(
    INITIAL_ACCOUNT,
    INITIAL_TRANSACTIONS,
    RECURRING_OBLIGATIONS,
    INITIAL_GOALS,
    '2026-09'
  );
  assert(
    'Financial Health Score Range & Transparency',
    healthScore.totalScore >= 65 && healthScore.totalScore <= 85 && healthScore.breakdown.length === 6,
    `Health score is ${healthScore.totalScore}/100 with ${healthScore.breakdown.length} weighted dimensions`
  );

  // 7. Cash Flow Forecast Test
  const forecast = calculateCashflowForecast(INITIAL_ACCOUNT, RECURRING_OBLIGATIONS, '2026-09-30', 60);
  assert(
    'Cash Flow 60-Day Forecast',
    forecast.timeline.length === 61 && forecast.minimumProjectedBalance > 0,
    `Generated ${forecast.timeline.length} forecast points; min balance PKR ${forecast.minimumProjectedBalance.toLocaleString()} on ${forecast.minimumBalanceDate}`
  );

  const passed = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed,
    results,
  };
}
