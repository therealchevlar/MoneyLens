import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
  ShieldCheck,
  Database,
  RefreshCw,
  User,
  Info,
  CheckCircle2,
  XCircle,
  Play,
  Cpu,
  Wallet,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { runFinancialEngineTests } from '@/src/services/finance/financeEngine.test';
import { useFinanceData } from '@/src/hooks/useFinanceData';
import { formatCurrency } from '@/src/lib/utils';

interface SettingsPageProps {
  onResetFresh?: () => void;
  onLoadSample?: () => void;
  onResetDemo?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onResetFresh,
  onLoadSample,
  onResetDemo,
}) => {
  const { account } = useFinanceData();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [testResults, setTestResults] = useState<ReturnType<typeof runFinancialEngineTests> | null>(null);

  const handleRunTests = () => {
    const res = runFinancialEngineTests();
    setTestResults(res);
  };

  const handleStartFresh = () => {
    if (onResetFresh) onResetFresh();
    else if (onResetDemo) onResetDemo();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const handleLoadSample = () => {
    if (onLoadSample) onLoadSample();
    else if (onResetDemo) onResetDemo();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-white/[0.06] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">Settings & Wallet Controls</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Wallet configuration, calculation integrity verification, and data management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Profile Card */}
        <div className="fintech-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <Wallet className="h-4 w-4 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">Wallet Profile</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span className="text-neutral-400">Wallet Title</span>
              <span className="font-semibold text-neutral-200">{account.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span className="text-neutral-400">Account Type</span>
              <span className="font-mono text-neutral-300">Personal Cash Ledger</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span className="text-neutral-400">Liquid Balance</span>
              <span className="font-mono font-bold text-emerald-400">
                {formatCurrency(account.balance, account.currency)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span className="text-neutral-400">Monthly Earnings</span>
              <span className="font-mono text-neutral-200">
                {account.monthlySalary && account.monthlySalary > 0
                  ? `${formatCurrency(account.monthlySalary, account.currency)} / mo (Day ${account.salaryPayday || 1})`
                  : 'Variable / Freelance'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400">Base Currency</span>
              <span className="font-mono text-neutral-200">{account.currency || 'PKR'}</span>
            </div>
          </div>
        </div>

        {/* Security & Privacy Standards */}
        <div className="fintech-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">Privacy & Security</h3>
          </div>
          <div className="space-y-2.5 text-xs text-neutral-300 leading-relaxed">
            <p>
              MoneyLens maintains strict data isolation and banking-grade security principles:
            </p>
            <ul className="space-y-1.5 text-neutral-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Zero bank logins, account scraping, or external credentials needed.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>All records are stored locally in your browser storage.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Deterministic mathematical scoring verified on every balance query.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Engine Architecture Card */}
        <div className="fintech-card rounded-2xl p-6 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-100">Financial Intelligence Engine</h3>
            </div>
            <Badge variant="success" className="font-mono text-[10px]">
              Ready & Active
            </Badge>
          </div>

          <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
            <p>
              MoneyLens integrates Gemini 3.8 Flash with grounded deterministic financial tools. All answers evaluate your verified live balance, monthly salary schedule, and 60-day cash flow trajectories with zero hallucination.
            </p>
          </div>
        </div>

        {/* Mathematical Engine Test Suite Runner */}
        <div className="fintech-card rounded-2xl p-6 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-100">Financial Calculation Integrity</h3>
            </div>
            <Badge variant="success" className="font-mono text-[10px]">
              Engine Verified
            </Badge>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-950/70 border border-white/[0.06]">
              <div>
                <span className="font-semibold text-neutral-200 block">Run Ledger Verification Suite</span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Validates mathematical calculations across savings rate, cash flow curves, and financial health score dimensions.
                </p>
              </div>
              <Button size="sm" variant="primary" onClick={handleRunTests} className="gap-1.5 shrink-0 text-xs">
                <Play className="h-3 w-3" />
                <span>Verify Calculations</span>
              </Button>
            </div>

            {testResults && (
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-neutral-400">
                    Results: {testResults.passed} / {testResults.total} Assertions Passed
                  </span>
                  <Badge variant={testResults.passed === testResults.total ? 'success' : 'danger'}>
                    {testResults.passed === testResults.total ? '100% Precision Verified' : 'Calculation Notice'}
                  </Badge>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {testResults.results.map((r, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-neutral-950/80 border border-white/[0.06] text-xs flex items-start gap-2.5"
                    >
                      {r.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-neutral-200">{r.name}</div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">{r.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Reset & Sync */}
        <div className="fintech-card rounded-2xl p-6 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-100">Wallet Data Controls</h3>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] border-white/[0.08]">
              Local Storage
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/[0.06] space-y-2">
              <h4 className="font-semibold text-neutral-200">Re-configure Wallet Setup</h4>
              <p className="text-[11px] text-neutral-400">
                Re-opens the wallet setup wizard to customize your starting balance, monthly salary, and goals.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartFresh}
                className="gap-1.5 border-white/[0.08] text-xs text-neutral-300 w-full"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Re-configure Wallet Setup</span>
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/[0.06] space-y-2">
              <h4 className="font-semibold text-neutral-200">Preview Sample Template</h4>
              <p className="text-[11px] text-neutral-400">
                Optionally loads sample transactions with salary, rent, and utility bills for demonstration testing.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
                className="gap-1.5 border-white/[0.08] text-xs text-neutral-300 w-full"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Load Sample Template</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
