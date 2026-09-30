import React, { useEffect } from 'react';
import { Transaction } from '@/src/types/finance';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { formatPKR, formatDate } from '@/src/lib/utils';
import {
  X,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Store,
  Tag,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  categoryAverage: number;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  categoryAverage,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'income';
  const ratio = categoryAverage > 0 ? (transaction.amount / categoryAverage).toFixed(1) : '1.0';
  const isUnusual = transaction.isUnusual || (categoryAverage > 0 && transaction.amount > categoryAverage * 2.5);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl fintech-card p-6 text-neutral-100 space-y-6 shadow-2xl border border-white/[0.1]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Transaction Record
              </span>
              <span className="text-[10px] font-mono text-neutral-500">ID: {transaction.id}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-100 mt-1">
              {transaction.merchant}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Hero Amount Display */}
        <div className="p-5 rounded-xl bg-neutral-950/80 border border-white/[0.06] text-center space-y-1">
          <span className="text-xs text-neutral-400 font-mono block">
            {isIncome ? 'Direct Ledger Deposit' : 'Cleared Outflow'}
          </span>
          <div
            className={`text-3xl sm:text-4xl font-black font-mono tracking-tight num-tabular ${
              isIncome ? 'text-emerald-400' : 'text-neutral-100'
            }`}
          >
            {isIncome ? '+' : '-'}
            {formatPKR(transaction.amount)}
          </div>
          <span className="text-[11px] text-neutral-500 font-mono block">
            Posted on {formatDate(transaction.date)}
          </span>
        </div>

        {/* Historical Category Comparison / Anomaly Context */}
        {!isIncome && (
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-white/[0.06] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-300">Category Comparison</span>
              <span className="font-mono text-neutral-400">
                Avg: {formatPKR(categoryAverage)}
              </span>
            </div>

            {isUnusual ? (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 space-y-1 text-neutral-300">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px] uppercase font-mono">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Unusual Activity Verified</span>
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-300">
                  This transaction is <strong className="text-amber-300">{ratio}x higher</strong> than your typical {transaction.category} baseline. In MoneyLens, this is tagged as an infrequent capital outlay rather than standard routine spending.
                </p>
              </div>
            ) : (
              <p className="text-neutral-400 text-[11px]">
                Within normal behavioral parameters for {transaction.category}.
              </p>
            )}
          </div>
        )}

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase font-mono">Category</span>
            <div className="font-semibold text-neutral-200">{transaction.category}</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase font-mono">Status</span>
            <div className="font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Cleared & Reconciled</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-2 border-t border-white/[0.06]">
          <Button variant="outline" size="sm" onClick={onClose} className="border-white/[0.1] text-xs">
            Close Record
          </Button>
        </div>
      </div>
    </div>
  );
};
