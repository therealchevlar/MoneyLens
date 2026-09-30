import {
  Account,
  CashFlowPoint,
  Goal,
  RecurringObligation,
} from '@/src/types/finance';
import { calculateCashflowForecast, calculateGoalsAnalytics } from '@/src/services/finance/financeEngine';

export interface SimulationResult {
  scenarioTitle: string;
  scenarioType: 'purchase' | 'expense_increase' | 'income_change' | 'savings_increase';
  description: string;
  currentProjectedBalance60d: number;
  simulatedProjectedBalance60d: number;
  balanceDifference: number; // simulated - current
  emergencyReserveStatus: {
    targetReserve: number; // e.g. PKR 100,000 or 3 months
    currentProjectedMinimum: number;
    simulatedProjectedMinimum: number;
    breached: boolean;
    deficitAmount: number;
  };
  goalImpacts: {
    goalId: string;
    goalName: string;
    originalCompletionDate: string;
    simulatedCompletionDate: string;
    delayInDays: number;
    impactDescription: string;
  }[];
  baselineTimeline: CashFlowPoint[];
  simulatedTimeline: CashFlowPoint[];
  verdict: 'safe' | 'caution' | 'high_risk';
  verdictSummary: string;
  actionableAlternatives: string[];
}

/**
 * Deterministically simulate an outright purchase (e.g. PKR 150,000 laptop)
 */
export function simulatePurchase(
  account: Account,
  recurring: RecurringObligation[],
  goals: Goal[],
  amount: number,
  itemName: string,
  purchaseDayOffset: number = 3,
  referenceDateStr: string = '2026-09-30'
): SimulationResult {
  const baselineForecast = calculateCashflowForecast(account, recurring, referenceDateStr, 60);

  // Simulated account with amount debited
  const simulatedTimeline: CashFlowPoint[] = [];
  let simBalance = account.balance;
  const startDate = new Date(referenceDateStr);

  let simMinBalance = simBalance;

  for (let i = 0; i <= 60; i++) {
    const curDate = new Date(startDate);
    curDate.setDate(curDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];
    const dayOfMonth = curDate.getDate();

    let dayIncome = 0;
    let dayExpense = 0;
    const events: string[] = [];

    // Purchase event
    if (i === purchaseDayOffset) {
      dayExpense += amount;
      events.push(`Purchase: ${itemName} (-PKR ${amount.toLocaleString()})`);
    }

    // Salary on the 1st
    if (dayOfMonth === 1 && i > 0) {
      dayIncome += 250000;
      events.push('Salary Deposit (+PKR 250k)');
    }

    // Recurring bills
    for (const rec of recurring) {
      if (rec.active && rec.dayOfMonth === dayOfMonth && i > 0) {
        dayExpense += rec.amount;
        events.push(`${rec.name} (-PKR ${rec.amount.toLocaleString()})`);
      }
    }

    // Daily living
    if (i > 0) {
      dayExpense += 900;
    }

    simBalance = simBalance + dayIncome - dayExpense;
    if (simBalance < simMinBalance) {
      simMinBalance = simBalance;
    }

    simTimelinePush(simulatedTimeline, dateStr, simBalance, i > 0, dayIncome, dayExpense, events);
  }

  const baselineEnd = baselineForecast.timeline[baselineForecast.timeline.length - 1].balance;
  const simulatedEnd = simulatedTimeline[simulatedTimeline.length - 1].balance;

  const targetReserve = 100000; // minimum safe buffer
  const breached = simMinBalance < targetReserve;
  const deficit = breached ? targetReserve - simMinBalance : 0;

  // Goals impact
  const currentGoals = calculateGoalsAnalytics(goals, referenceDateStr);
  const goalImpacts = currentGoals.map((g) => {
    // If user spends amount from liquid savings, goal completion may be pushed back
    const impactMonths = Math.ceil(amount / (g.monthlyContribution || 20000));
    const origDate = new Date(g.projectedCompletionDate);
    const simDate = new Date(origDate);
    simDate.setMonth(simDate.getMonth() + impactMonths);

    return {
      goalId: g.id,
      goalName: g.name,
      originalCompletionDate: g.projectedCompletionDate,
      simulatedCompletionDate: simDate.toISOString().split('T')[0],
      delayInDays: impactMonths * 30,
      impactDescription: `Liquid cash reduction delays progress by approximately ${impactMonths} month(s).`,
    };
  });

  const verdict = breached ? (simMinBalance < 30000 ? 'high_risk' : 'caution') : 'safe';
  const verdictSummary = breached
    ? `Purchasing ${itemName} for PKR ${amount.toLocaleString()} immediately pulls your projected buffer down to PKR ${simMinBalance.toLocaleString()}, falling PKR ${deficit.toLocaleString()} below your PKR 100,000 emergency reserve target.`
    : `Purchasing ${itemName} is affordable within your liquid cash flow without breaching your safety reserve target.`;

  return {
    scenarioTitle: `Purchase ${itemName} (PKR ${amount.toLocaleString()})`,
    scenarioType: 'purchase',
    description: `Immediate one-off capital expenditure of PKR ${amount.toLocaleString()}`,
    currentProjectedBalance60d: baselineEnd,
    simulatedProjectedBalance60d: simulatedEnd,
    balanceDifference: simulatedEnd - baselineEnd,
    emergencyReserveStatus: {
      targetReserve,
      currentProjectedMinimum: baselineForecast.minimumProjectedBalance,
      simulatedProjectedMinimum: simMinBalance,
      breached,
      deficitAmount: deficit,
    },
    goalImpacts,
    baselineTimeline: baselineForecast.timeline,
    simulatedTimeline,
    verdict,
    verdictSummary,
    actionableAlternatives: [
      'Split into 3 monthly installments of PKR ' + Math.round(amount / 3).toLocaleString() + ' to avoid dipping below emergency reserve.',
      'Delay purchase by 45 days until December to allow additional salary buffering.',
      'Reallocate PKR 25,000 from discretionary dining budget to cushion liquidity shock.',
    ],
  };
}

/**
 * Deterministically simulate recurring monthly expense changes (e.g. rent increase or new subscription)
 */
export function simulateRecurringExpenseChange(
  account: Account,
  recurring: RecurringObligation[],
  goals: Goal[],
  monthlyDelta: number,
  title: string,
  referenceDateStr: string = '2026-09-30'
): SimulationResult {
  const baselineForecast = calculateCashflowForecast(account, recurring, referenceDateStr, 60);

  const simulatedTimeline: CashFlowPoint[] = [];
  let simBalance = account.balance;
  const startDate = new Date(referenceDateStr);
  let simMinBalance = simBalance;

  for (let i = 0; i <= 60; i++) {
    const curDate = new Date(startDate);
    curDate.setDate(curDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];
    const dayOfMonth = curDate.getDate();

    let dayIncome = 0;
    let dayExpense = 0;
    const events: string[] = [];

    if (dayOfMonth === 1 && i > 0) {
      dayIncome += 250000;
      events.push('Salary Deposit (+PKR 250k)');
    }

    for (const rec of recurring) {
      if (rec.active && rec.dayOfMonth === dayOfMonth && i > 0) {
        dayExpense += rec.amount;
        events.push(`${rec.name} (-PKR ${rec.amount.toLocaleString()})`);
      }
    }

    // Additional recurring expense on the 5th
    if (dayOfMonth === 5 && i > 0) {
      dayExpense += monthlyDelta;
      events.push(`${title} (+PKR ${monthlyDelta.toLocaleString()}/mo)`);
    }

    if (i > 0) {
      dayExpense += 900;
    }

    simBalance = simBalance + dayIncome - dayExpense;
    if (simBalance < simMinBalance) simMinBalance = simBalance;

    simTimelinePush(simulatedTimeline, dateStr, simBalance, i > 0, dayIncome, dayExpense, events);
  }

  const baselineEnd = baselineForecast.timeline[baselineForecast.timeline.length - 1].balance;
  const simulatedEnd = simulatedTimeline[simulatedTimeline.length - 1].balance;
  const targetReserve = 100000;
  const breached = simMinBalance < targetReserve;

  const currentGoals = calculateGoalsAnalytics(goals, referenceDateStr);
  const goalImpacts = currentGoals.map((g) => ({
    goalId: g.id,
    goalName: g.name,
    originalCompletionDate: g.projectedCompletionDate,
    simulatedCompletionDate: g.projectedCompletionDate,
    delayInDays: Math.round((monthlyDelta / 25000) * 20),
    impactDescription: `Reduces monthly net savings capacity by PKR ${monthlyDelta.toLocaleString()}, tightening milestone funding.`,
  }));

  return {
    scenarioTitle: `${title} (+PKR ${monthlyDelta.toLocaleString()}/mo)`,
    scenarioType: 'expense_increase',
    description: `Permanent recurring increase in monthly commitments of PKR ${monthlyDelta.toLocaleString()}`,
    currentProjectedBalance60d: baselineEnd,
    simulatedProjectedBalance60d: simulatedEnd,
    balanceDifference: simulatedEnd - baselineEnd,
    emergencyReserveStatus: {
      targetReserve,
      currentProjectedMinimum: baselineForecast.minimumProjectedBalance,
      simulatedProjectedMinimum: simMinBalance,
      breached,
      deficitAmount: breached ? targetReserve - simMinBalance : 0,
    },
    goalImpacts,
    baselineTimeline: baselineForecast.timeline,
    simulatedTimeline,
    verdict: breached ? 'caution' : 'safe',
    verdictSummary: `An ongoing PKR ${monthlyDelta.toLocaleString()} monthly addition reduces your 60-day liquid reserves by PKR ${(monthlyDelta * 2).toLocaleString()} and lowers annual savings by PKR ${(monthlyDelta * 12).toLocaleString()}.`,
    actionableAlternatives: [
      'Negotiate utility or lease agreements to minimize increase.',
      'Offset the difference by auditing underutilized subscriptions (e.g. Coursera PKR 4,500/mo).',
    ],
  };
}

/**
 * Deterministically simulate an income change (e.g. -15% salary cut or +PKR 50k bonus)
 */
export function simulateIncomeChange(
  account: Account,
  recurring: RecurringObligation[],
  goals: Goal[],
  percentageChange: number, // e.g. -15 for -15%
  referenceDateStr: string = '2026-09-30'
): SimulationResult {
  const baselineForecast = calculateCashflowForecast(account, recurring, referenceDateStr, 60);

  const newSalary = 250000 * (1 + percentageChange / 100);
  const simulatedTimeline: CashFlowPoint[] = [];
  let simBalance = account.balance;
  const startDate = new Date(referenceDateStr);
  let simMinBalance = simBalance;

  for (let i = 0; i <= 60; i++) {
    const curDate = new Date(startDate);
    curDate.setDate(curDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];
    const dayOfMonth = curDate.getDate();

    let dayIncome = 0;
    let dayExpense = 0;
    const events: string[] = [];

    if (dayOfMonth === 1 && i > 0) {
      dayIncome += newSalary;
      events.push(`Adjusted Salary Deposit (+PKR ${Math.round(newSalary / 1000)}k)`);
    }

    for (const rec of recurring) {
      if (rec.active && rec.dayOfMonth === dayOfMonth && i > 0) {
        dayExpense += rec.amount;
        events.push(`${rec.name} (-PKR ${rec.amount.toLocaleString()})`);
      }
    }

    if (i > 0) dayExpense += 900;

    simBalance = simBalance + dayIncome - dayExpense;
    if (simBalance < simMinBalance) simMinBalance = simBalance;

    simTimelinePush(simulatedTimeline, dateStr, simBalance, i > 0, dayIncome, dayExpense, events);
  }

  const baselineEnd = baselineForecast.timeline[baselineForecast.timeline.length - 1].balance;
  const simulatedEnd = simulatedTimeline[simulatedTimeline.length - 1].balance;
  const targetReserve = 100000;
  const breached = simMinBalance < targetReserve;

  return {
    scenarioTitle: `Salary Adjustment (${percentageChange > 0 ? '+' : ''}${percentageChange}%)`,
    scenarioType: 'income_change',
    description: `Primary salary changes from PKR 250,000 to PKR ${Math.round(newSalary).toLocaleString()}/month`,
    currentProjectedBalance60d: baselineEnd,
    simulatedProjectedBalance60d: simulatedEnd,
    balanceDifference: simulatedEnd - baselineEnd,
    emergencyReserveStatus: {
      targetReserve,
      currentProjectedMinimum: baselineForecast.minimumProjectedBalance,
      simulatedProjectedMinimum: simMinBalance,
      breached,
      deficitAmount: breached ? targetReserve - simMinBalance : 0,
    },
    goalImpacts: [],
    baselineTimeline: baselineForecast.timeline,
    simulatedTimeline,
    verdict: percentageChange < 0 && simMinBalance < 50000 ? 'high_risk' : 'safe',
    verdictSummary: `A ${percentageChange}% adjustment modifies monthly cash inflow by PKR ${Math.abs(Math.round(newSalary - 250000)).toLocaleString()}.`,
    actionableAlternatives: [
      'Scale back discretionary food & lifestyle spending.',
      'Seek supplementary freelance contracts to replace lost revenue.',
    ],
  };
}

/**
 * Deterministically simulate increasing monthly savings contributions
 */
export function simulateSavingsIncrease(
  account: Account,
  recurring: RecurringObligation[],
  goals: Goal[],
  additionalMonthly: number,
  referenceDateStr: string = '2026-09-30'
): SimulationResult {
  const baselineForecast = calculateCashflowForecast(account, recurring, referenceDateStr, 60);

  const baselineEnd = baselineForecast.timeline[baselineForecast.timeline.length - 1].balance;

  const currentGoals = calculateGoalsAnalytics(goals, referenceDateStr);
  const goalImpacts = currentGoals.map((g) => {
    const newRate = g.monthlyContribution + additionalMonthly;
    const origMonths = Math.ceil(g.remainingAmount / (g.monthlyContribution || 1));
    const newMonths = Math.ceil(g.remainingAmount / newRate);
    const monthsSaved = Math.max(0, origMonths - newMonths);

    const origDate = new Date(g.projectedCompletionDate);
    const simDate = new Date(origDate);
    simDate.setMonth(simDate.getMonth() - monthsSaved);

    return {
      goalId: g.id,
      goalName: g.name,
      originalCompletionDate: g.projectedCompletionDate,
      simulatedCompletionDate: simDate.toISOString().split('T')[0],
      delayInDays: -monthsSaved * 30, // negative delay = acceleration
      impactDescription: `Accelerates ${g.name} target completion by approximately ${monthsSaved} month(s)!`,
    };
  });

  return {
    scenarioTitle: `Increase Monthly Savings by PKR ${additionalMonthly.toLocaleString()}`,
    scenarioType: 'savings_increase',
    description: `Systematic redirection of discretionary spend into active goal contributions`,
    currentProjectedBalance60d: baselineEnd,
    simulatedProjectedBalance60d: baselineEnd,
    balanceDifference: 0,
    emergencyReserveStatus: {
      targetReserve: 100000,
      currentProjectedMinimum: baselineForecast.minimumProjectedBalance,
      simulatedProjectedMinimum: baselineForecast.minimumProjectedBalance,
      breached: false,
      deficitAmount: 0,
    },
    goalImpacts,
    baselineTimeline: baselineForecast.timeline,
    simulatedTimeline: baselineForecast.timeline,
    verdict: 'safe',
    verdictSummary: `Allocating PKR ${additionalMonthly.toLocaleString()} extra per month significantly accelerates your university fee deadline.`,
    actionableAlternatives: [
      'Automate this transfer immediately upon 1st-of-month salary deposit.',
    ],
  };
}

function simTimelinePush(
  arr: CashFlowPoint[],
  date: string,
  balance: number,
  isProjected: boolean,
  income: number,
  expense: number,
  events: string[]
) {
  arr.push({
    date,
    balance: Math.round(balance),
    isProjected,
    income,
    expense,
    eventDescription: events.join(' • ') || undefined,
  });
}
