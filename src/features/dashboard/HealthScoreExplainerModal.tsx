import React from 'react';
import { FinancialHealthScore } from '@/src/types/finance';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Progress } from '@/src/components/ui/progress';
import { X, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';

interface HealthScoreExplainerModalProps {
  scoreData: FinancialHealthScore;
  isOpen: boolean;
  onClose: () => void;
}

export const HealthScoreExplainerModal: React.FC<HealthScoreExplainerModalProps> = ({
  scoreData,
  isOpen,
  onClose,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 text-neutral-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-bold tracking-tight text-neutral-100">
                Financial Health Score Architecture
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Transparent breakdown of how your {scoreData.totalScore}/100 score was deterministically calculated.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Overall Score Header */}
        <div className="my-5 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider block">
              Calculated Overall Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-neutral-100 font-mono">
                {scoreData.totalScore}
              </span>
              <span className="text-neutral-500 font-mono">/ 100</span>
              <span className="text-xs font-mono text-emerald-400 ml-2">
                ↑ {scoreData.change} pts vs last month
              </span>
            </div>
          </div>
          <Badge variant="success" className="text-xs px-2.5 py-1 font-mono">
            Rating: {scoreData.rating}
          </Badge>
        </div>

        {/* Breakdown List */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Weighted Score Dimensions
          </h3>

          <div className="space-y-3">
            {scoreData.breakdown.map((item) => (
              <div
                key={item.dimension}
                className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-200">{item.dimension}</span>
                    <Badge variant={item.status === 'excellent' ? 'success' : item.status === 'good' ? 'info' : 'warning'} className="text-[10px] py-0">
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 font-bold">{item.score} / 100</span>
                    <span className="text-neutral-500 text-[11px] ml-2">
                      (weight {(item.weight * 100).toFixed(0)}% = +{item.contribution} pts)
                    </span>
                  </div>
                </div>

                <Progress value={item.score} className="h-1.5 bg-neutral-800" indicatorClassName="bg-emerald-400" />

                <p className="text-[11px] text-neutral-400 leading-snug">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Notice */}
        <div className="mt-6 p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-neutral-200">Prototype Disclaimer:</span> This is a MoneyLens financial wellness heuristic designed for financial awareness. It is not an official banking credit score, FICO score, or formal creditworthiness assessment.
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-neutral-800 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Breakdown
          </Button>
        </div>
      </div>
    </div>
  );
};
