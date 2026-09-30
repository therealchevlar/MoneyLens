import React from 'react';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Cpu,
  SlidersHorizontal,
  ChevronRight,
  Target,
  LineChart,
  Bot,
  Zap,
  CheckCircle2,
  Lock,
  Compass,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { NavItem } from '@/src/types/navigation';
import { formatPKR } from '@/src/lib/utils';

interface LandingPageViewProps {
  onEnterApp: (targetTab?: NavItem) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterApp }) => {
  return (
    <div className="relative min-h-screen text-neutral-100 selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <header className="relative z-10 border-b border-white/[0.06] bg-neutral-950/70 backdrop-blur-md sticky top-0 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-neutral-900 border border-white/[0.1] flex items-center justify-center text-emerald-400 shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" className="stroke-white/20" />
                <circle cx="12" cy="12" r="4" className="stroke-emerald-400 fill-emerald-500/10" />
                <path d="M12 3v3" className="stroke-emerald-400" />
                <path d="M12 18v3" className="stroke-emerald-400" />
                <path d="M3 12h3" className="stroke-emerald-400" />
                <path d="M18 12h3" className="stroke-emerald-400" />
              </svg>
            </div>
            <div>
              <span className="font-bold tracking-tight text-base text-neutral-100 block leading-tight">
                MoneyLens
              </span>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400/90 uppercase block">
                Banking Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-mono border-white/[0.08] text-neutral-300">
              Allied Bank Limited • Private Suite
            </Badge>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEnterApp('dashboard')}
              className="gap-2 shadow-lg shadow-emerald-950/40 text-xs font-semibold"
            >
              <span>Access Banking</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
            Autonomous Banking & Predictive Cash Flow
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-100 max-w-4xl mx-auto leading-[1.08]">
          Your financial life, <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            understood.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Turn your everyday financial activity into actionable intelligence, forecast cash flow 60 days forward,
          and stress-test major purchases before you make them.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => onEnterApp('dashboard')}
            className="h-12 px-6 gap-2 text-sm font-semibold shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all"
          >
            <span>Open MoneyLens</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => onEnterApp('simulator')}
            className="h-12 px-6 gap-2 text-sm font-medium border-white/[0.1] bg-neutral-900/60 hover:bg-neutral-800/80 text-neutral-300"
          >
            <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
            <span>Test What-If Simulator</span>
          </Button>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="mt-16 rounded-2xl fintech-card p-6 sm:p-8 text-left max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block font-semibold">
                Account Ledger • Allied Bank Limited
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
                PKR 280,000 <span className="text-xs font-normal text-neutral-400">Available Liquid Balance</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="font-mono text-xs">
                Score: 74 / 100
              </Badge>
              <Badge variant="outline" className="font-mono text-xs border-white/[0.08]">
                Stable Liquidity
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/[0.06]">
              <span className="text-xs text-neutral-400 block">Monthly Inflow</span>
              <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                +PKR 250,000
              </span>
              <span className="text-[11px] text-neutral-500 mt-1 block">Cleared salary credit</span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/[0.06]">
              <span className="text-xs text-neutral-400 block">Monthly Outflow</span>
              <span className="text-lg font-bold font-mono text-neutral-200 mt-1 block">
                PKR 209,800
              </span>
              <span className="text-[11px] text-rose-400/90 mt-1 block">+18.2% dining surge</span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/[0.06]">
              <span className="text-xs text-neutral-400 block">60-Day Low Dip Buffer</span>
              <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                PKR 196,600
              </span>
              <span className="text-[11px] text-neutral-500 mt-1 block">Safe above PKR 100k floor</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section: UNDERSTAND • PREDICT • SIMULATE • ACT */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-2">
            The Financial Intelligence Architecture
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight">
            How MoneyLens transforms banking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* UNDERSTAND */}
          <div className="p-6 rounded-2xl fintech-card space-y-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                01. UNDERSTAND
              </span>
              <h3 className="text-base font-bold text-neutral-100 mt-1">
                Deconstruct Your Behavior
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pinpoints exact spending velocity shifts, itemizes dining surges across restaurant receipts, and flags atypical transactions before they impact your reserves.
            </p>
            <button
              onClick={() => onEnterApp('transactions')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 pt-2"
            >
              <span>Explore Transactions</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* PREDICT */}
          <div className="p-6 rounded-2xl fintech-card space-y-4">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <LineChart className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                02. PREDICT
              </span>
              <h3 className="text-base font-bold text-neutral-100 mt-1">
                Forecast 60 Days Forward
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Synchronizes scheduled apartment rent, LESCO power bills, and Nayatel internet against upcoming salary credits to predict cash dips before they occur.
            </p>
            <button
              onClick={() => onEnterApp('dashboard')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium inline-flex items-center gap-1 pt-2"
            >
              <span>View Cashflow Curve</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* SIMULATE */}
          <div className="p-6 rounded-2xl fintech-card space-y-4">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
                03. SIMULATE
              </span>
              <h3 className="text-base font-bold text-neutral-100 mt-1">
                What-If Decision Sandbox
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Stress-test capital outlays (Honda Civic, laptops, iPhones) or monthly rent changes against your minimum safety floor and goal milestones before spending a rupee.
            </p>
            <button
              onClick={() => onEnterApp('simulator')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1 pt-2"
            >
              <span>Open Simulator</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* ACT */}
          <div className="p-6 rounded-2xl fintech-card space-y-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                04. ACT
              </span>
              <h3 className="text-base font-bold text-neutral-100 mt-1">
                Autonomous Banking AI
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ask natural financial questions. MoneyLens uses deterministic banking tools to calculate feasibility, state debt burden ratios, and formulate installment plans.
            </p>
            <button
              onClick={() => onEnterApp('agent')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 pt-2"
            >
              <span>Ask MoneyLens AI</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-10 px-6 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-mono text-neutral-400">
            MoneyLens • Commercial Banking Intelligence Platform
          </p>
          <p>
            © 2026 MoneyLens Inc. All rights reserved. Bank-grade client encryption and precision ledger calculations.
          </p>
        </div>
      </footer>
    </div>
  );
};
