import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  AlertCircle,
  Tag,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  ShoppingBag,
  Home,
  Zap,
  Coffee,
  Car,
  Tv,
  BookOpen,
  DollarSign,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { useFinanceData } from '@/src/hooks/useFinanceData';
import { Transaction } from '@/src/types/finance';
import { formatPKR, formatDate } from '@/src/lib/utils';
import { TransactionDetailModal } from '@/src/features/transactions/TransactionDetailModal';

export const TransactionsView: React.FC = () => {
  const { transactions } = useFinanceData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc'>('date-desc');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Available unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((tx) => set.add(tx.category));
    return Array.from(set).sort();
  }, [transactions]);

  // Compute category averages for modal comparison
  const categoryAverages = useMemo(() => {
    const sums: Record<string, { total: number; count: number }> = {};
    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        if (!sums[tx.category]) sums[tx.category] = { total: 0, count: 0 };
        sums[tx.category].total += tx.amount;
        sums[tx.category].count += 1;
      }
    });
    const avgs: Record<string, number> = {};
    for (const cat in sums) {
      avgs[cat] = Math.round(sums[cat].total / sums[cat].count);
    }
    return avgs;
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchMerchant = tx.merchant.toLowerCase().includes(q);
          const matchDesc = tx.description.toLowerCase().includes(q);
          const matchCategory = tx.category.toLowerCase().includes(q);
          if (!matchMerchant && !matchDesc && !matchCategory) return false;
        }

        if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
          return false;
        }

        if (selectedType !== 'all') {
          if (selectedType === 'anomaly') {
            if (!tx.isUnusual) return false;
          } else if (tx.type !== selectedType) {
            return false;
          }
        }

        if (selectedMonth !== 'all' && !tx.date.startsWith(selectedMonth)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
        if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        return 0;
      });
  }, [transactions, searchQuery, selectedCategory, selectedType, selectedMonth, sortBy]);

  // Helper for merchant icons
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'housing & rent':
        return <Home className="h-4 w-4 text-emerald-400" />;
      case 'utilities':
        return <Zap className="h-4 w-4 text-amber-400" />;
      case 'dining & food':
        return <Coffee className="h-4 w-4 text-rose-400" />;
      case 'electronics':
        return <ShoppingBag className="h-4 w-4 text-indigo-400" />;
      case 'transport':
        return <Car className="h-4 w-4 text-sky-400" />;
      case 'subscriptions':
        return <Tv className="h-4 w-4 text-purple-400" />;
      case 'education':
        return <BookOpen className="h-4 w-4 text-teal-400" />;
      case 'income':
      case 'salary':
        return <DollarSign className="h-4 w-4 text-emerald-400" />;
      default:
        return <Building className="h-4 w-4 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">Transaction Ledger</h1>
            <Badge variant="outline" className="font-mono text-[10px] border-white/[0.08]">
              {filteredTransactions.length} Cleared Records
            </Badge>
          </div>
          <p className="text-sm text-neutral-400">
            Verified Pakistani banking entries with historical category baseline comparison.
          </p>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'expense', label: 'Outflows' },
            { id: 'income', label: 'Inflows' },
            { id: 'anomaly', label: 'Pattern Flags' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedType === type.id
                  ? 'bg-neutral-800 text-neutral-100 border border-white/[0.12] shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900/60 border border-white/[0.04]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant, description..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-950/80 border border-white/[0.08] rounded-xl text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950/80 border border-white/[0.08] rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-emerald-500/50 appearance-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500 pointer-events-none" />
        </div>

        {/* Month */}
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950/80 border border-white/[0.08] rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-emerald-500/50 appearance-none font-mono"
          >
            <option value="all">All Months</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">August 2026</option>
            <option value="2026-07">July 2026</option>
            <option value="2026-06">June 2026</option>
            <option value="2026-05">May 2026</option>
            <option value="2026-04">April 2026</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 bg-neutral-950/80 border border-white/[0.08] rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-emerald-500/50 appearance-none font-mono"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      {/* Transactions List */}
      <div className="fintech-card rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 space-y-2">
            <p>No transactions match your current search or filter criteria.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedMonth('all');
              }}
              className="text-xs border-white/[0.08]"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const catAvg = categoryAverages[tx.category] || 0;
            const isUnusual = tx.isUnusual || (catAvg > 0 && tx.amount > catAvg * 2.5);

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="p-4 sm:px-6 hover:bg-neutral-800/40 transition-colors cursor-pointer flex items-center justify-between gap-4 group"
              >
                {/* Left: Icon & Merchant details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-neutral-950 border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:border-white/[0.16] transition-colors">
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-100 text-sm truncate">
                        {tx.merchant}
                      </span>
                      {tx.isUnusual && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0">
                          <AlertCircle className="h-2.5 w-2.5" />
                          <span>Pattern Flag</span>
                        </span>
                      )}
                      {tx.isRecurring && (
                        <span className="hidden sm:inline-flex text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-full border border-white/[0.06] shrink-0">
                          Recurring
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-neutral-400">{formatDate(tx.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Trend info */}
                <div className="text-right shrink-0">
                  <div
                    className={`font-mono font-bold text-sm sm:text-base num-tabular ${
                      isIncome ? 'text-emerald-400' : 'text-neutral-100'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatPKR(tx.amount)}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                    {isIncome ? (
                      <span className="text-emerald-400">Direct Deposit</span>
                    ) : isUnusual ? (
                      <span className="text-amber-400">{(tx.amount / (catAvg || 1)).toFixed(1)}x avg</span>
                    ) : (
                      <span>Typical</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction Detail Slide-over / Modal */}
      <TransactionDetailModal
        transaction={selectedTx}
        categoryAverage={selectedTx ? categoryAverages[selectedTx.category] || 0 : 0}
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};
