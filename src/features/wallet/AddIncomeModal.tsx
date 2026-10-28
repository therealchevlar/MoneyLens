import React, { useState } from 'react';
import { X, ArrowUpRight, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { TransactionCategory } from '@/src/types/finance';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncome: (data: {
    title: string;
    amount: number;
    category: TransactionCategory;
    date: string;
    note?: string;
  }) => void;
  referenceDate: string;
}

export const AddIncomeModal: React.FC<AddIncomeModalProps> = ({
  isOpen,
  onClose,
  onAddIncome,
  referenceDate,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Salary');
  const [date, setDate] = useState(referenceDate || '2026-09-30');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(/,/g, ''));
    if (!parsedAmount || parsedAmount <= 0 || !title.trim()) return;

    onAddIncome({
      title: title.trim(),
      amount: parsedAmount,
      category,
      date,
      note: note.trim() || undefined,
    });

    setTitle('');
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl fintech-card p-6 text-neutral-100 shadow-2xl border border-white/[0.1] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">Add Income / Inflow</h3>
              <span className="text-[11px] text-neutral-400 block">Record money added to your wallet</span>
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
            <label className="block text-neutral-300 font-medium">Income Amount (PKR)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-mono font-bold text-sm">
                +PKR
              </span>
              <input
                type="number"
                min="1"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50,000"
                className="w-full pl-16 pr-4 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-emerald-500/50"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Title / Source */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium">Source / Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Freelance Web Project, Monthly Salary, Bonus"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-neutral-300 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Miscellaneous">Other Income</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-neutral-300 font-medium">Deposit Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/[0.08] rounded-xl text-neutral-200 font-mono text-xs focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium">Optional Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Client reference or payment details"
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
              className="text-xs font-semibold gap-1.5"
            >
              <span>Deposit Funds</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
