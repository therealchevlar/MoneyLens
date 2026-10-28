import React, { useState } from 'react';
import { X, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface EditSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSalary: number;
  currentPayday: number;
  onSaveSalary: (salary: number, payday: number) => void;
}

export const EditSalaryModal: React.FC<EditSalaryModalProps> = ({
  isOpen,
  onClose,
  currentSalary,
  currentPayday,
  onSaveSalary,
}) => {
  const [salary, setSalary] = useState(currentSalary ? currentSalary.toString() : '');
  const [payday, setPayday] = useState(currentPayday || 1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(salary.replace(/,/g, '')) || 0;
    onSaveSalary(Math.max(0, parsed), payday);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl fintech-card p-6 text-neutral-100 shadow-2xl border border-white/[0.1] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
          <div>
            <h3 className="text-base font-bold text-neutral-100">Monthly Salary & Recurring Earnings</h3>
            <span className="text-[11px] text-neutral-400 block">Configure regular expected income</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium">Monthly Salary Amount (PKR)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-mono font-bold text-sm">
                PKR
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="200,000"
                className="w-full pl-14 pr-4 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-emerald-500/50"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Set to 0 if your income is purely irregular / freelance.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium">Payday (Day of Month)</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <select
                value={payday}
                onChange={(e) => setPayday(parseInt(e.target.value, 10))}
                className="w-full pl-10 pr-3 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-200 font-mono text-xs focus:outline-none focus:border-emerald-500/50"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Day {d} of every month
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/[0.04] text-[11px] text-neutral-400 space-y-1">
            <span className="text-neutral-300 font-semibold block">How this powers MoneyLens:</span>
            <p>
              Your salary is projected into your 60-day forward cash flow curve and informs the What-If Simulator and MoneyLens AI without needing a bank connection.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.06]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-white/[0.08] text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs font-semibold gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Save Salary Settings</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
