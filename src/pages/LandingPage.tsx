import React from 'react';
import {
  Zap,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Bot,
  BrainCircuit,
  Eye,
  Sparkles,
  CalendarCheck2,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

interface LandingPageProps {
  onEnterDemo: () => void;
  onSelectScenario?: (scenarioKey: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDemo }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none blur-3xl opacity-60" />

      {/* Top Bar */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black tracking-tight text-neutral-100 text-lg">
                MONEY<span className="text-emerald-400">LENS</span>
              </span>
              <span className="text-[10px] text-neutral-400 ml-2 hidden sm:inline uppercase tracking-widest font-mono">
                Agentic Banking AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="warning" className="font-mono text-[11px] py-1">
              Allied Bank Fintech Hackathon 2026
            </Badge>
            <Button variant="primary" size="sm" onClick={onEnterDemo}>
              Launch Demo
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 text-center flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-medium mb-8 mx-auto">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Thematic Area: Agentic AI for Banking</span>
          <span className="text-neutral-600">•</span>
          <span className="text-emerald-400 font-mono">Pakistan Edition (PKR)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-100 leading-tight sm:leading-none max-w-4xl mx-auto">
          Your financial life,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            understood.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          MoneyLens transforms raw transaction data into deterministic intelligence. It doesn't just show your balance; it reasons, forecasts, and lets you simulate decisions before spending.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={onEnterDemo}
            className="px-8 shadow-lg shadow-emerald-500/20 text-base"
          >
            Explore 6-Month Demo
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center h-11 px-6 rounded-md text-sm font-medium text-neutral-300 hover:text-neutral-100 hover:bg-neutral-900 border border-neutral-800 transition-colors"
          >
            How MoneyLens Works
          </a>
        </div>

        {/* 5 Core Questions MoneyLens Solves */}
        <div className="mt-16 pt-10 border-t border-neutral-800/80">
          <p className="text-xs font-mono tracking-widest uppercase text-neutral-400 mb-6">
            The 5 Questions Traditional Banking Apps Leave Unanswered
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { num: '01', q: 'WHAT', label: 'is happening to my money?' },
              { num: '02', q: 'WHY', label: 'is it happening right now?' },
              { num: '03', q: 'WHAT NEXT', label: 'will happen in 30–60 days?' },
              { num: '04', q: 'WHAT IF', label: 'I make this purchase or change?' },
              { num: '05', q: 'WHAT CAN', label: 'I do to protect my goals?' },
            ].map((item) => (
              <div
                key={item.num}
                className="p-3.5 rounded-lg border border-neutral-800/70 bg-neutral-900/40 text-left hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
                  <span>{item.num}</span>
                  <span className="font-bold">{item.q}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The 4 Pillars */}
        <section id="how-it-works" className="mt-20 text-left">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100 mb-2 text-center">
            Agentic AI Architecture
          </h2>
          <p className="text-sm text-neutral-400 text-center max-w-xl mx-auto mb-10">
            Unlike superficial chatbot wrappers, MoneyLens combines deterministic math with tool-calling AI agents.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-neutral-800 bg-neutral-900/60 p-5">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base text-neutral-100 mb-1">1. Understand</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Deterministic Financial Health Engine scores stability, savings rate, and volatility from 0 to 100 with zero hallucinated math.
              </p>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/60 p-5">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base text-neutral-100 mb-1">2. Predict</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Deterministic cash flow projection anticipates upcoming salary, utility bills, and low-balance events up to 60 days ahead.
              </p>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/60 p-5">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base text-neutral-100 mb-1">3. Simulate</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                "What-If" simulation sandbox tests capital purchases (e.g. PKR 150,000 laptop) against reserve targets before money leaves the bank.
              </p>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/60 p-5">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base text-neutral-100 mb-1">4. Agentic AI</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Tool-calling MoneyLens AI investigates transactions, inspects upcoming bills, and executes scenarios with transparent reasoning.
              </p>
            </Card>
          </div>
        </section>

        {/* Demo Scenarios for Judges */}
        <div className="mt-16 text-left p-6 rounded-xl border border-neutral-800 bg-neutral-900/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
                Competition Demo Guide
              </span>
              <h3 className="text-lg font-bold text-neutral-100">
                Prepared Scenarios for Hackathon Evaluation
              </h3>
            </div>
            <Button size="sm" variant="primary" onClick={onEnterDemo}>
              Open Demo Environment
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-emerald-400 font-mono font-semibold">Scenario A: Spending Analysis</span>
              <p className="text-neutral-400 mt-1">
                "Why did my food spending increase 18% this month?" — MoneyLens breaks down restaurant spikes over the last 2 weeks.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-emerald-400 font-mono font-semibold">Scenario B: What-If Simulation</span>
              <p className="text-neutral-400 mt-1">
                "Can I afford a PKR 150,000 laptop?" — Evaluates balance, upcoming rent & bills, and warns about emergency reserve drop.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-emerald-400 font-mono font-semibold">Scenario C: Cashflow & Bills</span>
              <p className="text-neutral-400 mt-1">
                "Will I have enough money next month?" — Models 60-day projected trajectory with recurring K-Electric and rent obligations.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-emerald-400 font-mono font-semibold">Scenario D: University Fee Goal</span>
              <p className="text-neutral-400 mt-1">
                "Will I reach my university fee goal?" — Analyzes PKR 84,000 / 200,000 target and required monthly pace.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 px-6 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-neutral-300">MoneyLens</span> — Prepared for Allied Bank 5th Fintech Hackathon 2026.
          </div>
          <div className="text-neutral-400">
            Thematic Area: <span className="text-emerald-400 font-medium">Agentic AI for Banking</span>
          </div>
          <div className="font-mono text-[11px] text-neutral-400">
            Currency: PKR • Simulated Data Environment
          </div>
        </div>
      </footer>
    </div>
  );
};
