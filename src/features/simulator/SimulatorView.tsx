import React, { useState } from 'react';
import {
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Calendar,
  Layers,
  HelpCircle,
  Laptop,
  Home,
  PiggyBank,
  Briefcase,
  Tv,
  Car,
  RotateCcw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { useFinanceData } from '@/src/hooks/useFinanceData';
import {
  simulatePurchase,
  simulateRecurringExpenseChange,
  simulateIncomeChange,
  simulateSavingsIncrease,
  SimulationResult,
} from '@/src/services/simulator/simulationEngine';
import { SimulationChart } from '@/src/features/simulator/SimulationChart';
import { formatPKR, formatDate } from '@/src/lib/utils';
import { NavItem } from '@/src/types/navigation';

interface SimulatorViewProps {
  onNavigate: (tab: NavItem) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ onNavigate }) => {
  const { account, recurring, goals, referenceDate } = useFinanceData();

  // Active scenario selection
  const [activePreset, setActivePreset] = useState<string>('laptop');

  // Custom scenario state
  const [customType, setCustomType] = useState<'purchase' | 'expense' | 'savings'>('purchase');
  const [customAmount, setCustomAmount] = useState<number>(150000);
  const [customName, setCustomName] = useState<string>('Capital Purchase');

  // Compute the active simulation result deterministically
  const simulationResult: SimulationResult = React.useMemo(() => {
    switch (activePreset) {
      case 'laptop':
        return simulatePurchase(account, recurring, goals, 150000, 'Work Laptop Upgrade', 3, referenceDate);
      case 'civic':
        return simulatePurchase(account, recurring, goals, 2550000, 'Honda Civic 30% Down Payment', 5, referenceDate);
      case 'rent':
        return simulateRecurringExpenseChange(account, recurring, goals, 10000, 'Apartment Rent Hike', referenceDate);
      case 'savings':
        return simulateSavingsIncrease(account, recurring, goals, 20000, referenceDate);
      case 'custom':
        if (customType === 'purchase') {
          return simulatePurchase(account, recurring, goals, customAmount, customName || 'Custom Purchase', 3, referenceDate);
        } else if (customType === 'expense') {
          return simulateRecurringExpenseChange(account, recurring, goals, customAmount, customName || 'Recurring Expense', referenceDate);
        } else {
          return simulateSavingsIncrease(account, recurring, goals, customAmount, referenceDate);
        }
      default:
        return simulatePurchase(account, recurring, goals, 150000, 'Work Laptop Upgrade', 3, referenceDate);
    }
  }, [activePreset, customType, customAmount, customName, account, recurring, goals, referenceDate]);

  const {
    scenarioTitle,
    currentProjectedBalance60d,
    simulatedProjectedBalance60d,
    balanceDifference,
    emergencyReserveStatus,
    goalImpacts,
    baselineTimeline,
    simulatedTimeline,
  } = simulationResult;

  const presets = [
    {
      id: 'laptop',
      title: 'PKR 150k Laptop',
      category: 'Capital Outlay',
      icon: <Laptop className="h-4 w-4 text-emerald-400" />,
      desc: 'One-off equipment purchase of PKR 150,000.',
    },
    {
      id: 'civic',
      title: 'Civic 30% Down Payment',
      category: 'Automotive Loan',
      icon: <Car className="h-4 w-4 text-amber-400" />,
      desc: 'Mandatory PKR 2,550,000 down payment for Honda Civic.',
    },
    {
      id: 'rent',
      title: 'Rent Hike (+10k/mo)',
      category: 'Recurring Expense',
      icon: <Home className="h-4 w-4 text-rose-400" />,
      desc: 'Landlord increases apartment rent from PKR 55k to 65k.',
    },
    {
      id: 'savings',
      title: 'Save +PKR 20k/mo',
      category: 'Surplus Acceleration',
      icon: <PiggyBank className="h-4 w-4 text-teal-400" />,
      desc: 'Direct additional monthly surplus towards semester fees.',
    },
    {
      id: 'custom',
      title: 'Interactive Sliders',
      category: 'Custom Sandbox',
      icon: <SlidersHorizontal className="h-4 w-4 text-indigo-400" />,
      desc: 'Adjust arbitrary purchase or recurring figures dynamically.',
    },
  ];

  const handleReset = () => {
    setActivePreset('laptop');
    setCustomAmount(150000);
    setCustomType('purchase');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
              What-If Financial Decision Sandbox
            </h1>
            <Badge variant="outline" className="font-mono text-[10px] border-emerald-500/30 text-emerald-400">
              Deterministic Trajectory
            </Badge>
          </div>
          <p className="text-sm text-neutral-400">
            Stress-test major purchases, rent hikes, or savings changes against your cash reserves before spending a single rupee.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-2 text-xs border-white/[0.08] text-neutral-300 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Scenario</span>
        </Button>
      </div>

      {/* Preset Scenario Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {presets.map((p) => {
          const isActive = activePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePreset(p.id)}
              className={`p-3.5 rounded-2xl text-left transition-all ${
                isActive
                  ? 'fintech-card-active'
                  : 'fintech-card hover:border-white/[0.16]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-7 w-7 rounded-lg bg-neutral-950 border border-white/[0.08] flex items-center justify-center">
                  {p.icon}
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">{p.category}</span>
              </div>
              <div className="font-bold text-xs text-neutral-100">{p.title}</div>
              <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{p.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Grid: LEFT (Scenario Controls) vs RIGHT (Financial Impact & Before/After) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Controls & Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="fintech-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Scenario Parameters
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Active: {scenarioTitle}
              </span>
            </div>

            {/* If Custom preset is selected, show interactive sliders */}
            {activePreset === 'custom' ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Scenario Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'purchase', label: 'One-off Outlay' },
                      { id: 'expense', label: 'Monthly Expense' },
                      { id: 'savings', label: 'Savings Boost' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setCustomType(t.id as any)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                          customType === t.id
                            ? 'bg-neutral-800 text-neutral-100 border border-white/[0.1]'
                            : 'bg-neutral-950 text-neutral-400 border border-white/[0.04]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-neutral-400">Impact Amount (PKR)</span>
                    <span className="font-mono font-bold text-neutral-100 text-sm num-tabular">
                      {formatPKR(customAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                    <span>PKR 10,000</span>
                    <span>PKR 1,000,000</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Scenario Action</span>
                  <div className="font-bold text-sm text-neutral-100">{scenarioTitle}</div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Simulates immediate deduction against current liquidity of {formatPKR(account.balance)}.
                  </p>
                </div>
              </div>
            )}

            {/* Reserve Safety Floor Indicator */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/[0.06] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Emergency Reserve Floor</span>
                <span className="font-mono font-bold text-amber-400">PKR 100,000</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    emergencyReserveStatus.breached ? 'bg-rose-500' : 'bg-emerald-400'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (emergencyReserveStatus.simulatedProjectedMinimum / 100000) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>Safe Buffer Zone</span>
                <span className={emergencyReserveStatus.breached ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {emergencyReserveStatus.breached ? 'Breached Floor' : 'Preserved Floor'}
                </span>
              </div>
            </div>

            {/* One-click Action to Ask AI */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('agent')}
              className="w-full text-xs gap-1.5 border-white/[0.08] text-neutral-300 hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Ask MoneyLens AI to Analyze This Move</span>
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: BEFORE / AFTER Comparison & Impact (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* VISUAL BEFORE / AFTER COMPARISON CARD */}
          <div className="fintech-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Before vs After Financial Impact
              </span>
              <Badge
                variant={emergencyReserveStatus.breached ? 'danger' : 'success'}
                className="font-mono text-[10px]"
              >
                {emergencyReserveStatus.breached ? 'Reserve Deficit' : 'Safe Liquidity'}
              </Badge>
            </div>

            {/* Before / After Metrics Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CURRENT */}
              <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-semibold">
                  Current Liquidity
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-neutral-200 num-tabular">
                  {formatPKR(account.balance)}
                </div>
                <span className="text-[11px] text-neutral-400 block font-mono">
                  60-day projected: {formatPKR(currentProjectedBalance60d)}
                </span>
              </div>

              {/* AFTER SIMULATION */}
              <div
                className={`p-4 rounded-xl border space-y-1 ${
                  emergencyReserveStatus.breached
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-emerald-950/20 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider block font-bold text-neutral-400">
                    Projected After Decision
                  </span>
                  <span className="text-[10px] font-mono font-bold text-rose-400">
                    {balanceDifference < 0 ? '-' : '+'}
                    {formatPKR(Math.abs(balanceDifference))}
                  </span>
                </div>
                <div
                  className={`text-2xl sm:text-3xl font-black font-mono num-tabular ${
                    emergencyReserveStatus.breached ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {formatPKR(simulatedProjectedBalance60d)}
                </div>
                <span className="text-[11px] font-mono block text-neutral-300">
                  Projected low dip: {formatPKR(emergencyReserveStatus.simulatedProjectedMinimum)}
                </span>
              </div>
            </div>

            {/* Goal Timeline Impact */}
            {goalImpacts.length > 0 && (
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/[0.06] space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                  Milestone Deadline Impact
                </span>
                {goalImpacts.map((g) => (
                  <div key={g.goalId} className="flex items-center justify-between py-1">
                    <span className="text-neutral-300">{g.goalName}</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {g.delayInDays > 0
                        ? `Delayed by ~${Math.round(g.delayInDays / 30)} months`
                        : 'On Track (Zero Delay)'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Trajectory Recharts Visualization */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                60-Day Trajectory Comparison (Baseline vs Scenario)
              </span>
              <SimulationChart
                baselineTimeline={baselineTimeline}
                simulatedTimeline={simulatedTimeline}
                reserveTarget={100000}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
