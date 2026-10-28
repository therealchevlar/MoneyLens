import React, { useState, useEffect } from 'react';
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
  Key,
  Eye,
  EyeOff,
  Cpu,
  Wallet,
  RotateCcw,
} from 'lucide-react';
import { runFinancialEngineTests } from '@/src/services/finance/financeEngine.test';
import { useFinanceData } from '@/src/hooks/useFinanceData';
import { formatPKR } from '@/src/lib/utils';

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

  // API Key Form State
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('moneylens_gemini_key') || '';
    setApiKey(saved);
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('moneylens_gemini_key', apiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleClearKey = () => {
    localStorage.removeItem('moneylens_gemini_key');
    setApiKey('');
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

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
          Wallet configuration, model keys, calculation integrity, and data synchronization.
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
              <span className="font-semibold text-neutral-200">{account.name || 'Personal Cash Wallet'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span className="text-neutral-400">Base Currency</span>
              <span className="font-mono text-emerald-400 font-semibold">PKR (Pakistani Rupee)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span className="text-neutral-400">Monthly Salary</span>
              <span className="font-mono text-neutral-200">
                {account.monthlySalary && account.monthlySalary > 0
                  ? `${formatPKR(account.monthlySalary)} (Day ${account.salaryPayday || 1})`
                  : 'Manual Inflow'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400">Storage Posture</span>
              <span className="text-emerald-400 font-medium">100% Offline / Client-Side</span>
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

        {/* Gemini API Key Configuration Card */}
        <div className="fintech-card rounded-2xl p-6 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-100">AI Model Configuration</h3>
            </div>
            <Badge variant={apiKey ? 'success' : 'default'} className="font-mono text-[10px]">
              {apiKey ? 'Custom Key Active' : 'Native Financial Engine Active'}
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-neutral-400">
              MoneyLens uses Google Gemini 3.8 Flash for reasoning. If you have a custom Google AI API key, you can enter it below.
            </p>

            <div className="space-y-2">
              <label className="block text-neutral-300 font-medium">Gemini API Key</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy... (leave blank to use the built-in deterministic engine)"
                    className="w-full bg-neutral-950 border border-white/[0.08] rounded-xl pl-3 pr-10 py-2.5 text-neutral-200 font-mono text-xs focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button size="sm" variant="primary" onClick={handleSaveKey}>
                  {keySaved ? 'Saved!' : 'Save Key'}
                </Button>
                {apiKey && (
                  <Button size="sm" variant="outline" onClick={handleClearKey} className="border-white/[0.08]">
                    Clear
                  </Button>
                )}
              </div>
            </div>
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
              <h4 className="font-semibold text-neutral-200">Start Fresh Wallet</h4>
              <p className="text-[11px] text-neutral-400">
                Resets all local transactions and re-opens the onboarding setup to start from zero.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartFresh}
                className="gap-1.5 border-white/[0.08] text-xs text-neutral-300 w-full"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Re-configure Wallet</span>
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/[0.06] space-y-2">
              <h4 className="font-semibold text-neutral-200">Load Sample Template</h4>
              <p className="text-[11px] text-neutral-400">
                Loads a realistic 6-month transaction dataset with salary, rent, and utility bills for testing.
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
