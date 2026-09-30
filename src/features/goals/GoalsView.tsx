import React, { useState } from 'react';
import { Target, Plus, Edit2, Trash2, Calendar, AlertCircle, CheckCircle2, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { useFinanceData } from '@/src/hooks/useFinanceData';
import { calculateGoalsAnalytics } from '@/src/services/finance/financeEngine';
import { formatPKR, formatDate } from '@/src/lib/utils';
import { Goal } from '@/src/types/finance';
import { GoalModal } from '@/src/features/goals/GoalModal';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, referenceDate } = useFinanceData();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const analytics = calculateGoalsAnalytics(goals, referenceDate);

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>, goalId?: string) => {
    if (goalId) {
      updateGoal(goalId, goalData);
    } else {
      addGoal(goalData);
    }
  };

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete financial milestone "${name}"?`)) {
      deleteGoal(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">Financial Milestones</h1>
            <Badge variant="outline" className="font-mono text-[10px] border-white/[0.08]">
              {goals.length} Active Targets
            </Badge>
          </div>
          <p className="text-sm text-neutral-400">
            Deterministic pace monitoring, required monthly contributions, and projected completion dates.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="gap-2 shadow-lg shadow-emerald-950/40"
        >
          <Plus className="h-4 w-4" />
          <span>New Milestone</span>
        </Button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="fintech-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              Cumulative Milestone Capital
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black font-mono text-neutral-100 num-tabular">
                {formatPKR(totalSaved)}
              </span>
              <span className="text-sm text-neutral-400 font-mono">
                of {formatPKR(totalTarget)} ({overallProgress}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[11px] text-neutral-400 block font-mono">Total Monthly Allocation</span>
              <span className="text-sm font-bold font-mono text-emerald-400 block num-tabular">
                {formatPKR(goals.reduce((s, g) => s + g.monthlyContribution, 0))}/month
              </span>
            </div>
          </div>
        </div>

        <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/[0.06] mt-4">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analytics.map((g) => {
          const rawGoal = goals.find((item) => item.id === g.id);
          const isAtRisk = g.status !== 'on_track';

          return (
            <div key={g.id} className="fintech-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between border-b border-white/[0.06] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
                      {g.category}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-100 mt-0.5">{g.name}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isAtRisk ? 'warning' : 'success'}
                      className="font-mono text-[10px] py-0.5"
                    >
                      {isAtRisk ? 'Pace Shortfall' : 'On Track'}
                    </Badge>

                    {rawGoal && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(rawGoal)}
                          className="p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(g.id, g.name)}
                          className="p-1 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-neutral-800"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Details */}
                <div className="my-4 space-y-2">
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-2xl font-bold text-neutral-100 num-tabular">
                      {formatPKR(g.currentAmount)}
                    </span>
                    <span className="text-xs text-neutral-400">
                      Target: {formatPKR(g.targetAmount)} ({g.progressPercentage}%)
                    </span>
                  </div>

                  <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/[0.06]">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isAtRisk ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${g.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Motivational Strategic Guidance */}
                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-white/[0.06] text-xs space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold block">
                    Strategic Pace Guidance
                  </span>
                  <p className="text-neutral-300 leading-relaxed">
                    {isAtRisk ? (
                      <span>
                        Increase monthly savings by <strong className="text-amber-300 font-mono">PKR {Math.max(0, g.requiredMonthlySavings - g.monthlyContribution).toLocaleString()}</strong> to reach your target on time.
                      </span>
                    ) : (
                      <span>
                        At your current pace of <strong className="text-emerald-300 font-mono">{formatPKR(g.monthlyContribution)}/mo</strong>, you are projected to reach your goal before {g.deadline}.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Footer Meta */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>Target Deadline: {g.deadline}</span>
                <span className="text-neutral-200">
                  Current Pace: {formatPKR(g.monthlyContribution)}/mo
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal Modal */}
      <GoalModal
        goal={editingGoal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGoal}
      />
    </div>
  );
};
