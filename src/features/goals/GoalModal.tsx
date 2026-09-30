import React, { useState, useEffect } from 'react';
import { Goal } from '@/src/types/finance';
import { Button } from '@/src/components/ui/button';
import { X, Target } from 'lucide-react';

interface GoalModalProps {
  goal: Goal | null; // null for new goal, Goal for edit
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: Omit<Goal, 'id' | 'createdAt'>, goalId?: string) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ goal, isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Education');
  const [targetAmount, setTargetAmount] = useState(200000);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(25000);
  const [deadline, setDeadline] = useState('2026-12-31');

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setCategory(goal.category);
      setTargetAmount(goal.targetAmount);
      setCurrentAmount(goal.currentAmount);
      setMonthlyContribution(goal.monthlyContribution);
      setDeadline(goal.deadline);
    } else {
      setName('');
      setCategory('Education');
      setTargetAmount(150000);
      setCurrentAmount(10000);
      setMonthlyContribution(15000);
      setDeadline('2027-01-31');
    }
  }, [goal, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        category,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount),
        monthlyContribution: Number(monthlyContribution),
        deadline,
      },
      goal ? goal.id : undefined
    );
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 text-neutral-100 space-y-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold tracking-tight text-neutral-100">
              {goal ? 'Edit Financial Goal' : 'Create New Financial Goal'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Goal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. University Fees, Laptop, Emergency Reserve"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Education">Education</option>
                <option value="Safety">Safety / Emergency</option>
                <option value="Technology">Technology</option>
                <option value="Travel">Travel</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Investments">Investments</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Target Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Target Amount (PKR)</label>
              <input
                type="number"
                required
                min={1000}
                step={5000}
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Current Amount (PKR)</label>
              <input
                type="number"
                required
                min={0}
                step={5000}
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium">
              Planned Monthly Contribution (PKR)
            </label>
            <input
              type="number"
              required
              min={500}
              step={1000}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              MoneyLens will calculate required pace and projected completion date.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {goal ? 'Update Goal' : 'Save Goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
