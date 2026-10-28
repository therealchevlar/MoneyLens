import React, { useState } from 'react';
import { Wallet, Sparkles, ArrowRight, ShieldCheck, DollarSign, Calendar, X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

interface SetupWalletModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onComplete: (config: {
    startingBalance: number;
    monthlySalary: number;
    salaryPayday: number;
    walletName: string;
  }) => void;
  onLoadSample: () => void;
}

export const SetupWalletModal: React.FC<SetupWalletModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onLoadSample,
}) => {
  const [startingBalance, setStartingBalance] = useState<string>('280000');
  const [monthlySalary, setMonthlySalary] = useState<string>('250000');
  const [salaryPayday, setSalaryPayday] = useState<number>(1);
  const [walletName, setWalletName] = useState<string>('Personal Cash Wallet');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balanceNum = parseFloat(startingBalance.replace(/,/g, '')) || 0;
    const salaryNum = parseFloat(monthlySalary.replace(/,/g, '')) || 0;
    onComplete({
      startingBalance: Math.max(0, balanceNum),
      monthlySalary: Math.max(0, salaryNum),
      salaryPayday,
      walletName: walletName.trim() || 'Personal Cash Wallet',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl fintech-card p-6 sm:p-8 text-neutral-100 shadow-2xl border border-white/[0.1] space-y-6">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Header */}
        <div className="space-y-1.5 text-center sm:text-left pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-1">
            <Wallet className="h-3.5 w-3.5" />
            <span>Standalone Personal Wallet</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100">
            Configure Your Personal Wallet
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Take complete control of your finances. Customize your liquid balance, salary schedule, and personal ledger.
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Starting Balance */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium">
              Current Liquid / Cash Balance (PKR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-sm">
                PKR
              </span>
              <input
                type="number"
                min="0"
                step="500"
                value={startingBalance}
                onChange={(e) => setStartingBalance(e.target.value)}
                placeholder="0"
                className="w-full pl-14 pr-4 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-100 font-mono text-sm focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Your opening cash balance. You can start with 0 or enter your actual savings.
            </p>
          </div>

          {/* Monthly Salary & Payday */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-neutral-300 font-medium">
                Monthly Salary / Income (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">
                  PKR
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  placeholder="200000"
                  className="w-full pl-12 pr-3 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-100 font-mono text-xs focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-neutral-300 font-medium">
                Salary Payday (Day of Month)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <select
                  value={salaryPayday}
                  onChange={(e) => setSalaryPayday(parseInt(e.target.value, 10))}
                  className="w-full pl-10 pr-3 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-200 font-mono text-xs focus:outline-none focus:border-emerald-500/50"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      Day {day} of every month
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Wallet Name */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium">
              Wallet Label
            </label>
            <input
              type="text"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="Personal Cash Wallet"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/[0.04] flex items-start gap-2.5 text-[11px] text-neutral-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              100% private and offline-first. Your financial entries remain in your browser with zero bank credentials or external servers required.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onLoadSample}
              className="text-xs text-neutral-400 hover:text-emerald-400 underline transition-colors"
            >
              Or load sample template data
            </button>

            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto h-10 px-6 gap-2 text-xs font-semibold shadow-lg shadow-emerald-950/40"
            >
              <span>Initialize My Wallet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
