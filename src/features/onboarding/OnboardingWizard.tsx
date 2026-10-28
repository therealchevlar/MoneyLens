import React, { useState } from 'react';
import {
  Wallet,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Calendar,
  Sparkles,
  Target,
  DollarSign,
  Briefcase,
  TrendingUp,
  ShieldAlert,
  Laptop,
  GraduationCap,
  Plane,
  Car,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

interface OnboardingWizardProps {
  onComplete: (config: {
    walletName: string;
    currency: string;
    startingBalance: number;
    monthlySalary: number;
    salaryPayday: number;
    initialGoal?: {
      name: string;
      category: string;
      targetAmount: number;
      deadline: string;
      monthlyContribution: number;
    };
  }) => void;
  onLoadSample?: () => void;
}

const CURRENCIES = [
  { code: 'PKR', symbol: '₨', label: 'PKR (Pakistani Rupee)' },
  { code: 'USD', symbol: '$', label: 'USD (US Dollar)' },
  { code: 'EUR', symbol: '€', label: 'EUR (Euro)' },
  { code: 'GBP', symbol: '£', label: 'GBP (British Pound)' },
  { code: 'AED', symbol: 'د.إ', label: 'AED (UAE Dirham)' },
  { code: 'SAR', symbol: '﷼', label: 'SAR (Saudi Riyal)' },
  { code: 'CAD', symbol: '$', label: 'CAD (Canadian Dollar)' },
  { code: 'INR', symbol: '₹', label: 'INR (Indian Rupee)' },
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onLoadSample,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [walletName, setWalletName] = useState<string>('Personal Cash Wallet');
  const [currency, setCurrency] = useState<string>('PKR');
  const [startingBalance, setStartingBalance] = useState<string>('50000');
  const [hasRegularSalary, setHasRegularSalary] = useState<boolean>(true);
  const [monthlySalary, setMonthlySalary] = useState<string>('150000');
  const [salaryPayday, setSalaryPayday] = useState<number>(1);

  // Goal State
  const [includeGoal, setIncludeGoal] = useState<boolean>(true);
  const [selectedGoalType, setSelectedGoalType] = useState<string>('emergency');
  const [goalName, setGoalName] = useState<string>('Emergency Reserve Fund');
  const [goalAmount, setGoalAmount] = useState<string>('150000');
  const [goalMonths, setGoalMonths] = useState<number>(6);

  const selectedCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const handleGoalTypeChange = (type: string) => {
    setSelectedGoalType(type);
    switch (type) {
      case 'emergency':
        setGoalName('Emergency Reserve Fund');
        setGoalAmount('150000');
        setGoalMonths(6);
        break;
      case 'education':
        setGoalName('Education & University Fees');
        setGoalAmount('200000');
        setGoalMonths(4);
        break;
      case 'tech':
        setGoalName('Work Laptop Upgrade');
        setGoalAmount('120000');
        setGoalMonths(3);
        break;
      case 'travel':
        setGoalName('Vacation & Travel Fund');
        setGoalAmount('250000');
        setGoalMonths(6);
        break;
      case 'custom':
        setGoalName('New Milestone Target');
        setGoalAmount('100000');
        setGoalMonths(6);
        break;
    }
  };

  const handleFinish = () => {
    const balanceNum = parseFloat(startingBalance.replace(/,/g, '')) || 0;
    const salaryNum = hasRegularSalary ? parseFloat(monthlySalary.replace(/,/g, '')) || 0 : 0;
    const goalAmountNum = parseFloat(goalAmount.replace(/,/g, '')) || 0;

    let initialGoalConfig = undefined;
    if (includeGoal && goalAmountNum > 0) {
      const deadlineDate = new Date();
      deadlineDate.setMonth(deadlineDate.getMonth() + goalMonths);
      const monthlyPace = Math.round(goalAmountNum / Math.max(1, goalMonths));

      initialGoalConfig = {
        name: goalName.trim() || 'Emergency Reserve',
        category: selectedGoalType === 'emergency' ? 'Safety' : 'Milestone',
        targetAmount: goalAmountNum,
        deadline: deadlineDate.toISOString().split('T')[0],
        monthlyContribution: monthlyPace,
      };
    }

    onComplete({
      walletName: walletName.trim() || 'Personal Cash Wallet',
      currency,
      startingBalance: Math.max(0, balanceNum),
      monthlySalary: Math.max(0, salaryNum),
      salaryPayday,
      initialGoal: initialGoalConfig,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-xl fintech-card rounded-2xl border border-white/[0.08] shadow-2xl p-6 sm:p-8 bg-neutral-900/90 backdrop-blur-xl space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-neutral-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-neutral-100 block">MoneyLens</span>
              <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase block">
                Wallet Initialization
              </span>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-[10px] border-emerald-500/30 text-emerald-400">
            Step {step} of 4
          </Badge>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: WALLET IDENTITY & CURRENCY */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100">
                Set up your personal wallet
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Customize your cash ledger title and base currency. Zero bank logins or account scraping.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-neutral-300 font-medium">Wallet Nickname</label>
                <input
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  placeholder="Personal Cash Wallet"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-300 font-medium">Display Currency</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CURRENCIES.map((cur) => (
                    <button
                      key={cur.code}
                      type="button"
                      onClick={() => setCurrency(cur.code)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        currency === cur.code
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-sm'
                          : 'border-white/[0.06] bg-neutral-950 text-neutral-400 hover:border-white/[0.15] hover:text-neutral-200'
                      }`}
                    >
                      <span className="font-mono text-sm font-bold">{cur.code}</span>
                      <span className="text-[11px] opacity-75">{cur.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/[0.04] flex items-start gap-2.5 text-[11px] text-neutral-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Everything is saved securely in your browser's private storage. No servers, no tracking, completely offline-first.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: STARTING CASH BALANCE */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100">
                What is your starting cash balance?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Enter your current cash in hand or wallet funds. You can start with 0 and add earnings anytime.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-neutral-500">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance(e.target.value)}
                    placeholder="0"
                    className="w-full pl-16 pr-4 py-3 bg-neutral-950 border border-white/[0.1] rounded-xl text-neutral-100 font-mono text-xl sm:text-2xl font-bold focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-[11px] text-neutral-500">Quick set:</span>
                  {['0', '25000', '50000', '100000', '250000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setStartingBalance(preset)}
                      className={`px-2.5 py-1 rounded-lg border font-mono text-xs transition-colors ${
                        startingBalance === preset
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {preset === '0' ? 'Start Clean (0)' : `${currency} ${parseInt(preset, 10).toLocaleString()}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-white/[0.04] text-xs text-neutral-300 space-y-1">
                <span className="font-semibold text-neutral-200 block">💡 Ledger Entry Note</span>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  If set to positive, a single opening cash deposit entry will be registered in your ledger so your balance matches your records immediately.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MONTHLY SALARY & INCOME SCHEDULE */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100">
                Income & Salary Schedule
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Tell MoneyLens how you earn so our 60-day predictive engine can accurately model cash flows.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasRegularSalary(true)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    hasRegularSalary
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-neutral-100'
                      : 'border-white/[0.06] bg-neutral-950 text-neutral-400 hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold text-neutral-100 text-xs">Regular Monthly Salary</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Fixed predictable earnings deposited on a specific day each month.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setHasRegularSalary(false)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    !hasRegularSalary
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-neutral-100'
                      : 'border-white/[0.06] bg-neutral-950 text-neutral-400 hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold text-neutral-100 text-xs">Variable / Freelance</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    No fixed schedule. You'll log cash deposits anytime via "+ Add Income".
                  </p>
                </button>
              </div>

              {hasRegularSalary && (
                <div className="space-y-4 p-4 rounded-xl bg-neutral-950/80 border border-white/[0.06]">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-300 font-medium">
                      Monthly Take-Home Salary ({currency})
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-neutral-500 text-xs">
                        {currency}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(e.target.value)}
                        placeholder="150000"
                        className="w-full pl-14 pr-3 py-2.5 bg-neutral-900 border border-white/[0.08] rounded-xl text-neutral-100 font-mono text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-300 font-medium">Payday (Day of Month)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                      <select
                        value={salaryPayday}
                        onChange={(e) => setSalaryPayday(parseInt(e.target.value, 10))}
                        className="w-full pl-10 pr-3 py-2.5 bg-neutral-900 border border-white/[0.08] rounded-xl text-neutral-200 font-mono text-xs focus:outline-none focus:border-emerald-500/50"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>
                            Day {day} of every month {day === 1 ? '(1st)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: FINANCIAL GOAL & REVIEW */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100">
                Set your first milestone
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Optional: define a target to track progress and pace requirements.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/70 border border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <span className="font-medium text-neutral-200">Enable initial savings goal</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeGoal}
                  onChange={(e) => setIncludeGoal(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                />
              </div>

              {includeGoal && (
                <div className="space-y-3 p-4 rounded-xl bg-neutral-950/80 border border-white/[0.06]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'emergency', label: 'Emergency', icon: ShieldAlert },
                      { id: 'education', label: 'Education', icon: GraduationCap },
                      { id: 'tech', label: 'Tech Gadget', icon: Laptop },
                      { id: 'travel', label: 'Travel', icon: Plane },
                    ].map((g) => {
                      const IconComp = g.icon;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => handleGoalTypeChange(g.id)}
                          className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                            selectedGoalType === g.id
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                              : 'border-white/[0.06] bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <IconComp className="h-4 w-4" />
                          <span className="text-[11px] font-medium">{g.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-neutral-400 text-[11px]">Milestone Title</label>
                      <input
                        type="text"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-white/[0.08] rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-neutral-400 text-[11px]">Target Amount ({currency})</label>
                      <input
                        type="number"
                        min="1000"
                        step="5000"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-white/[0.08] rounded-xl text-neutral-100 font-mono text-xs focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Ready to Launch Summary */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <span className="font-semibold text-emerald-400 text-xs block">✨ Ready to launch:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block">Starting Cash:</span>
                    <span className="font-mono font-bold text-neutral-100">
                      {currency} {(parseFloat(startingBalance.replace(/,/g, '')) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Income Model:</span>
                    <span className="font-mono font-bold text-neutral-100">
                      {hasRegularSalary
                        ? `${currency} ${(parseFloat(monthlySalary.replace(/,/g, '')) || 0).toLocaleString()} /mo`
                        : 'Variable Earnings'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/[0.06]">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setStep((s) => s - 1)}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setStep((s) => s + 1)}
              className="gap-1.5 text-xs font-semibold px-5"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleFinish}
              className="gap-2 text-xs font-bold px-6 shadow-lg shadow-emerald-950/50"
            >
              <Sparkles className="h-4 w-4" />
              <span>Initialize My Wallet & Launch</span>
            </Button>
          )}
        </div>

        {/* Discrete Sample Template Option for Testing */}
        {onLoadSample && (
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={onLoadSample}
              className="text-[11px] text-neutral-500 hover:text-emerald-400 transition-colors underline"
            >
              Or preview with sample template data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
