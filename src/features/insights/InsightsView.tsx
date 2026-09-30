import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Receipt,
  Target,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Zap,
  Filter,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { useFinanceData } from '@/src/hooks/useFinanceData';
import { generateInsights, DynamicInsight } from '@/src/services/ai/insightGenerator';
import { NavItem } from '@/src/types/navigation';

interface InsightsViewProps {
  onNavigate: (tab: NavItem) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ onNavigate }) => {
  const { account, transactions, recurring, goals, referenceDate } = useFinanceData();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('ins_spending_dining');

  // Generate dynamic insights directly from active data
  const allInsights: DynamicInsight[] = React.useMemo(() => {
    return generateInsights(account, transactions, recurring, goals, referenceDate);
  }, [account, transactions, recurring, goals, referenceDate]);

  // Organize by the requested 4 intelligence tiers: Attention, Opportunity, Progress, Pattern
  const categorizedInsights = React.useMemo(() => {
    return allInsights.map((ins) => {
      let tier: 'Attention' | 'Opportunity' | 'Progress' | 'Pattern' = 'Pattern';
      if (ins.severity === 'high' || ins.severity === 'warning') {
        tier = 'Attention';
      } else if (ins.type === 'subscriptions') {
        tier = 'Opportunity';
      } else if (ins.severity === 'positive') {
        tier = 'Progress';
      } else {
        tier = 'Pattern';
      }
      return { ...ins, tier };
    });
  }, [allInsights]);

  const filteredInsights = categorizedInsights.filter((ins) => {
    if (selectedFilter === 'all') return true;
    return ins.tier.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">Financial Insights & Signals</h1>
            <Badge variant="success" className="font-mono text-[10px]">
              {allInsights.length} Active Observations
            </Badge>
          </div>
          <p className="text-sm text-neutral-400">
            Autonomous intelligence synthesized deterministically from transactions, cashflow forecasts, and recurring bills.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate('agent')}
          className="gap-2 shadow-lg shadow-emerald-950/40 text-xs"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask MoneyLens AI</span>
        </Button>
      </div>

      {/* Intelligence Tier Tabs: Attention • Opportunity • Progress • Pattern */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-neutral-500 font-mono flex items-center gap-1 mr-1">
          <Filter className="h-3.5 w-3.5" /> Tier:
        </span>
        {[
          { id: 'all', label: 'All Observations' },
          { id: 'attention', label: 'Attention Required' },
          { id: 'opportunity', label: 'Optimization Opportunities' },
          { id: 'progress', label: 'Positive Progress' },
          { id: 'pattern', label: 'Behavioral Patterns' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedFilter === tab.id
                ? 'bg-neutral-800 text-neutral-100 border border-white/[0.12] shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900/60 border border-white/[0.04]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="fintech-card rounded-2xl p-12 text-center text-neutral-500 text-xs">
            No intelligence signals in this tier at this time.
          </div>
        ) : (
          filteredInsights.map((ins) => {
            const isExpanded = expandedId === ins.id;

            const tierBadgeVariant =
              ins.tier === 'Attention'
                ? 'warning'
                : ins.tier === 'Progress'
                ? 'success'
                : ins.tier === 'Opportunity'
                ? 'default'
                : 'outline';

            return (
              <div
                key={ins.id}
                className="fintech-card rounded-2xl p-6 transition-all space-y-4 border border-white/[0.08]"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Badge variant={tierBadgeVariant} className="text-[10px] uppercase font-mono py-0.5">
                      {ins.tier}
                    </Badge>
                    <span className="text-xs font-mono text-neutral-400">{ins.category}</span>
                  </div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ins.id)}
                    className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1 font-medium"
                  >
                    <span>{isExpanded ? 'Hide Supporting Breakdown' : 'View Supporting Breakdown'}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-100">{ins.title}</h3>
                  <p className="text-sm text-neutral-300 mt-1.5 leading-relaxed">{ins.summary}</p>
                </div>

                {/* Supporting Data & Detailed Reason */}
                {isExpanded && (
                  <div className="space-y-4 pt-4 border-t border-white/[0.06] animate-in fade-in duration-150">
                    <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/[0.06] space-y-1.5 text-xs text-neutral-300 leading-relaxed">
                      <span className="font-semibold text-emerald-400 block font-mono text-[11px] uppercase tracking-wider">
                        Underlying Analytical Context
                      </span>
                      <p>{ins.explanation}</p>
                    </div>

                    {/* Supporting Data Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {Object.entries(ins.supportingData).map(([key, val]) => (
                        <div key={key} className="p-3 rounded-xl bg-neutral-950/60 border border-white/[0.06]">
                          <span className="text-[10px] text-neutral-500 block truncate font-mono uppercase">{key}</span>
                          <span className="font-mono font-bold text-neutral-100 mt-0.5 block truncate text-xs num-tabular">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action recommendation */}
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-emerald-400 block">Recommended Action:</span>
                        <p className="text-neutral-300 mt-0.5">{ins.recommendedAction}</p>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onNavigate(ins.actionTarget)}
                        className="shrink-0 gap-1.5 text-xs font-semibold"
                      >
                        <span>{ins.actionButtonText}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
