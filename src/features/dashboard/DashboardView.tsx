import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  AlertTriangle,
  Award,
  Wallet,
  Clock,
  ChevronRight,
  Filter,
  Eye,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { useFinanceData } from '@/src/hooks/useFinanceData';
import {
  calculateCategorySpending,
  calculateFinancialHealth,
  calculateGoalsAnalytics,
  calculateMonthlyTotals,
  calculateRecurringExpenses,
  calculateSavingsRate,
  calculateCashflowForecast,
} from '@/src/services/finance/financeEngine';
import { generateInsights } from '@/src/services/ai/insightGenerator';
import { formatPKR, formatPercent } from '@/src/lib/utils';
import { NavItem } from '@/src/types/navigation';
import { HealthScoreExplainerModal } from './HealthScoreExplainerModal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface DashboardViewProps {
  onNavigate: (tab: NavItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { account, transactions, recurring, goals, referenceDate } = useFinanceData();
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  const currentMonth = '2026-09';
  const previousMonth = '2026-08';

  // Deterministic calculations
  const totals = calculateMonthlyTotals(transactions, currentMonth);
  const prevTotals = calculateMonthlyTotals(transactions, previousMonth);
  const healthScore = calculateFinancialHealth(account, transactions, recurring, goals, currentMonth);
  const savingsRate = calculateSavingsRate(transactions, currentMonth);
  const recurringCalc = calculateRecurringExpenses(recurring);
  const categorySpending = calculateCategorySpending(transactions, currentMonth, previousMonth);
  const goalsAnalytics = calculateGoalsAnalytics(goals, referenceDate);
  const cashflowForecast = calculateCashflowForecast(account, recurring, referenceDate, 60);
  const activeInsights = generateInsights(account, transactions, recurring, goals, referenceDate);
  const heroInsight = activeInsights[1] || activeInsights[0]; // Dining surge or top anomaly

  const topCategories = categorySpending.slice(0, 4);

  // Cash flow chart data with Past vs Today vs Future distinction
  const chartData = cashflowForecast.timeline.map((pt) => {
    const isPast = pt.date < referenceDate;
    const isToday = pt.date === referenceDate;
    return {
      date: pt.date.slice(5), // '09-15'
      fullDate: pt.date,
      balance: pt.balance,
      isProjected: pt.isProjected,
      isToday,
      isPast,
      events: pt.eventDescription ? [pt.eventDescription] : [],
      label: pt.date.slice(5),
    };
  });

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HERO EXECUTIVE BANNER: "Good morning, Ali" + Alive Health Score + Hero Insight
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Hero: Greeting & Alive Health Score (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl fintech-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Financial Health & Status
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Allied Bank • Account •••• 0918
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
              Good morning, Ali
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Here is how your money is performing today.
            </p>
          </div>

          {/* Alive Score Visualization */}
          <div className="my-6 p-4 rounded-xl bg-neutral-950/80 border border-white/[0.06] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                MoneyLens Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-mono text-neutral-100 num-tabular tracking-tight">
                  {healthScore.totalScore}
                </span>
                <span className="text-xs font-mono text-neutral-400">/ 100</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+6 pts this month</span>
                <span className="text-neutral-400">• {healthScore.rating}</span>
              </div>
            </div>

            {/* Segmented Quality Indicator Bars */}
            <div className="space-y-1.5 w-32">
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>Liquidity</span>
                <span className="text-emerald-400">92/100</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '92%' }} />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-neutral-400 pt-1">
                <span>Savings</span>
                <span className="text-emerald-400">70/100</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '70%' }} />
              </div>

              <button
                onClick={() => setIsHealthModalOpen(true)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 mt-2 pt-1"
              >
                <span>View Breakdown</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/[0.06]">
            <span>Audit & Verification</span>
            <span className="font-mono text-emerald-400">Bank-Grade Precision</span>
          </div>
        </div>

        {/* Right Hero: Hero Money Insight ✦ (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl fintech-card p-6 flex flex-col justify-between border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-neutral-900/60 to-neutral-900/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Money Insight ✦
                </span>
              </div>
              <Badge variant="warning" className="text-[10px] font-mono uppercase py-0.5">
                Attention Required
              </Badge>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-neutral-100 mt-4 leading-snug">
              "Your food & dining spending surged +18.2% this month."
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
              Household groceries remained flat (+1.2%), but four late-September restaurant visits (Cafe Aylanto, Ginsoy, Kolachi, Chai Khana) drove PKR 5,000 in excess discretionary spending.
            </p>
          </div>

          {/* Supporting Numbers Pill Grid */}
          <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-white/[0.06]">
              <span className="text-[10px] text-neutral-400 block font-mono">September Outflow</span>
              <span className="font-mono font-bold text-neutral-100 text-sm mt-0.5 block num-tabular">
                PKR 32,500
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-white/[0.06]">
              <span className="text-[10px] text-neutral-400 block font-mono">August Baseline</span>
              <span className="font-mono font-bold text-neutral-400 text-sm mt-0.5 block num-tabular">
                PKR 27,500
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-white/[0.06]">
              <span className="text-[10px] text-neutral-400 block font-mono">Net Surge</span>
              <span className="font-mono font-bold text-rose-400 text-sm mt-0.5 block num-tabular">
                +PKR 5,000
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-white/[0.06]">
              <span className="text-[10px] text-neutral-400 block font-mono">Growth Delta</span>
              <span className="font-mono font-bold text-rose-400 text-sm mt-0.5 block num-tabular">
                +18.2%
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
            <span className="text-[11px] text-neutral-400">
              Recommended: Set a weekly dining cap of PKR 4,000 to restore baseline.
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('transactions')}
                className="text-xs border-white/[0.1] hover:bg-neutral-800 text-neutral-200"
              >
                Inspect Receipts
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('agent')}
                className="text-xs gap-1.5"
              >
                <Sparkles className="h-3 w-3" />
                <span>Ask AI Why</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          METRIC HIERARCHY SYSTEM: Available Balance Hero + Sub-Metrics
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance (HERO METRIC) */}
        <div className="fintech-card rounded-2xl p-5 border-emerald-500/30 relative">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Available Liquid Balance
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Primary Ledger
            </span>
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-neutral-100 num-tabular">
            {formatPKR(account.balance)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-400">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">+8.4%</span>
            <span>from August close</span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="fintech-card rounded-2xl p-5">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              September Inflow
            </span>
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400 num-tabular">
            {formatPKR(totals.income)}
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Salary credited on Sep 1 • 100% on time
          </div>
        </div>

        {/* Monthly Spending */}
        <div className="fintech-card rounded-2xl p-5">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              September Outflow
            </span>
            <ArrowDownRight className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral-100 num-tabular">
            {formatPKR(totals.expense)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-rose-400/90 font-medium">
            <span>+PKR 14,800</span>
            <span className="text-neutral-500 font-normal">vs August ({formatPKR(prevTotals.expense)})</span>
          </div>
        </div>

        {/* Net Savings & Rate */}
        <div className="fintech-card rounded-2xl p-5">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              Net Savings & Rate
            </span>
            <Badge variant="success" className="font-mono text-[10px] py-0">
              16.1% Rate
            </Badge>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400 num-tabular">
            +{formatPKR(totals.netSavings)}
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Retained surplus after all debits
          </div>
        </div>
      </div>

      {/* =========================================================================
          CASH FLOW TIMELINE: PAST vs TODAY vs FUTURE (Professional Recharts Tool)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 fintech-card rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-100">
                  60-Day Cash Flow Trajectory
                </h3>
                <Badge variant="outline" className="text-[10px] font-mono border-white/[0.1] text-emerald-400">
                  Past vs Forecast
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Deterministic projection modeling scheduled salary credits, rent, and utility deductions.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Forecast Balance</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="h-0.5 w-3 bg-amber-400" />
                <span>PKR 100k Floor</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                  tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="fintech-card p-3 rounded-xl text-xs space-y-1.5 shadow-2xl border border-white/[0.1]">
                          <div className="flex justify-between gap-4 font-mono text-[11px] text-neutral-400">
                            <span>{data.fullDate}</span>
                            <span className={data.isProjected ? 'text-emerald-400' : 'text-neutral-300'}>
                              {data.isProjected ? 'Projected' : 'Actual'}
                            </span>
                          </div>
                          <div className="text-base font-bold font-mono text-neutral-100 num-tabular">
                            {formatPKR(data.balance)}
                          </div>
                          {data.events && data.events.length > 0 && (
                            <div className="pt-1 border-t border-white/[0.08] space-y-0.5 text-[11px] text-neutral-300">
                              <span className="text-[10px] text-neutral-500 uppercase font-mono block">
                                Scheduled Events:
                              </span>
                              {data.events.map((ev: string, i: number) => (
                                <div key={i} className="text-emerald-400 font-mono">
                                  • {ev}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={100000}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#balanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-neutral-400">
              Minimum projected dip: <strong className="text-emerald-400 font-mono">{formatPKR(cashflowForecast.minimumProjectedBalance)}</strong> on Oct 12.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('simulator')}
              className="text-xs h-7 border-white/[0.08] text-neutral-300"
            >
              Test Scenarios in What-If
            </Button>
          </div>
        </div>

        {/* Right: Upcoming Recurring Obligations */}
        <div className="fintech-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-100">
                  Upcoming Commitments
                </h3>
                <span className="text-xs text-neutral-400 block mt-0.5">
                  Next 15 calendar days
                </span>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] border-white/[0.08]">
                {recurring.filter((r) => r.active).length} Active
              </Badge>
            </div>

            <div className="space-y-3 mt-4">
              {recurring
                .filter((r) => r.active)
                .slice(0, 4)
                .map((bill) => (
                  <div
                    key={bill.id}
                    className="p-3 rounded-xl bg-neutral-950/70 border border-white/[0.06] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-neutral-200 block">{bill.name}</span>
                      <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
                        Due: {bill.nextDueDate} (Day {bill.dayOfMonth})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-neutral-100 block num-tabular">
                        {formatPKR(bill.amount)}
                      </span>
                      <span className="text-[10px] text-emerald-400 block font-mono">
                        Auto-Scheduled
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] text-xs text-neutral-400 flex items-center justify-between">
            <span>Total Monthly Recurring:</span>
            <span className="font-mono font-bold text-neutral-200">
              {formatPKR(recurringCalc.totalMonthly)}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM ROW: Category Spending Breakdown + Goals Countdown
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Spending Categories */}
        <div className="fintech-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                Top Spending Outflows
              </h3>
              <span className="text-xs text-neutral-400 block mt-0.5">
                September vs August comparative analysis
              </span>
            </div>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View Ledger</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            {topCategories.map((cat) => {
              const isIncrease = cat.percentageChange > 0;
              return (
                <div key={cat.category} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-neutral-200">{cat.category}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-neutral-100 num-tabular">
                        {formatPKR(cat.currentMonth)}
                      </span>
                      <span
                        className={`text-[11px] ${
                          isIncrease ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {isIncrease ? '+' : ''}
                        {cat.percentageChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/[0.04]">
                    <div
                      className={`h-full rounded-full ${
                        cat.category === 'Dining & Food'
                          ? 'bg-rose-500'
                          : cat.category === 'Rent'
                          ? 'bg-emerald-500'
                          : 'bg-neutral-400'
                      }`}
                      style={{ width: `${Math.min(100, cat.percentageOfTotal * 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Goals Milestone Tracker */}
        <div className="fintech-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                Active Financial Milestones
              </h3>
              <span className="text-xs text-neutral-400 block mt-0.5">
                Target pace and deadline tracking
              </span>
            </div>
            <button
              onClick={() => onNavigate('goals')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Manage Goals</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            {goalsAnalytics.map((goal) => (
              <div
                key={goal.id}
                className="p-4 rounded-xl bg-neutral-950/70 border border-white/[0.06] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-100">{goal.name}</span>
                  <Badge
                    variant={goal.status === 'on_track' ? 'success' : 'warning'}
                    className="font-mono text-[10px]"
                  >
                    {goal.status === 'on_track' ? 'On Track' : 'Needs +PKR 16.4k/mo'}
                  </Badge>
                </div>

                <div className="flex justify-between font-mono text-[11px] text-neutral-400">
                  <span>Saved: {formatPKR(goal.currentAmount)}</span>
                  <span>Target: {formatPKR(goal.targetAmount)} ({goal.progressPercentage}%)</span>
                </div>

                <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${goal.progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                  <span>Deadline: {goal.deadline}</span>
                  <span className="font-mono text-neutral-300">
                    Contributing: {formatPKR(goal.monthlyContribution)}/mo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Score Explainer Modal */}
      <HealthScoreExplainerModal
        scoreData={healthScore}
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />
    </div>
  );
};
