import React, { useState } from 'react';
import { X, ArrowDownRight, RefreshCw, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { TransactionCategory } from '@/src/types/finance';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (data: {
    title: string;
    amount: number;
    category: TransactionCategory;
    date: string;
    isRecurring: boolean;
    recurringDay?: number;
    note?: string;
  }) => void;
  referenceDate: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  referenceDate,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Groceries');
  const [date, setDate] = useState(referenceDate || '2026-09-30');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDay, setRecurringDay] = useState(1);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(/,/g, ''));
    if (!parsedAmount || parsedAmount <= 0 || !title.trim()) return;

    onAddExpense({
      title: title.trim(),
      amount: parsedAmount,
      category,
      date,
      isRecurring,
      recurringDay: isRecurring ? recurringDay : undefined,
      note: note.trim() || undefined,
    });

    setTitle('');
    setAmount('');
    setIsRecurring(false);
    setNote('');
    onClose();
  };

  const categories: TransactionCategory[] = [
    'Groceries',
    'Dining & Food',
    'Rent',
    'Utilities',
    'Transport & Fuel',
    'Subscriptions',
    'Shopping',
    'Education',
    'Healthcare',
    'Entertainment',
    'Miscellaneous',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl fintech-card p-6 text-neutral-100 shadow-2xl border border-white/[0.1] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">Record Expense</h3>
              <span className="text-[11px] text-neutral-400 block">Deduct an outlay from your wallet</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Amount */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium">Expense Amount (PKR)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400 font-mono font-bold text-sm">
                -PKR
              </span>
              <input
                type="number"
                min="1"
                step="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="4,500"
                className="w-full pl-16 pr-4 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-rose-400 font-mono font-bold text-base focus:outline-none focus:border-rose-500/50"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Description / Merchant */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium">Merchant / Description</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Metro Supermarket, Apartment Rent, Electricity Bill"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-neutral-300 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-emerald-500/50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-neutral-300 font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-200 font-mono text-xs focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>
          </div>

          {/* Recurring Toggle */}
          <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-white/[0.06] space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-200 block">Repeat Monthly (Recurring Bill)</span>
                <span className="text-[11px] text-neutral-400 block">
                  Automatically schedules in your 60-day cash flow forecast
                </span>
              </div>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
              />
            </label>

            {isRecurring && (
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between animate-in fade-in">
                <span className="text-neutral-400">Due on Day of Month:</span>
                <select
                  value={recurringDay}
                  onChange={(e) => setRecurringDay(parseInt(e.target.value, 10))}
                  className="px-2.5 py-1 bg-neutral-900 border border-white/[0.1] rounded-lg text-neutral-100 font-mono text-xs"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Day {d}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium">Optional Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Receipt details or notes"
              className="w-full px-3.5 py-2 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-300 text-xs focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Actions */}
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
              className="text-xs font-semibold gap-1.5 bg-rose-600 hover:bg-rose-500 text-white border-0 shadow-lg shadow-rose-950/40"
            >
              <span>Record Expense</span>
              <ArrowDownRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
