import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Clock,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  Layers,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { agentService, AgentResponse, AgentStep } from '@/src/services/ai/agentService';
import { NavItem } from '@/src/types/navigation';
import { formatPKR } from '@/src/lib/utils';

interface AgentViewProps {
  onNavigate: (tab: NavItem) => void;
}

export const AgentView: React.FC<AgentViewProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<AgentResponse[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<AgentStep[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { label: 'Can I afford a Honda Civic?', tag: 'Automotive Simulation' },
    { label: 'Can I afford a PKR 150,000 laptop?', tag: 'Capital Purchase' },
    { label: 'Can I buy an iPhone 16?', tag: 'Electronics' },
    { label: 'Why did my food spending increase 18%?', tag: 'Behavioral Audit' },
    { label: 'Which subscriptions am I paying for?', tag: 'Recurring Commitments' },
    { label: 'Will I have enough money next month?', tag: 'Cashflow Trajectory' },
    { label: 'Will I reach my university fee goal?', tag: 'Milestone Pace' },
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputValue;
    if (!text.trim() || isLoading) return;

    setInputValue('');
    setIsLoading(true);
    setCurrentSteps([]);

    try {
      const response = await agentService.processQuery(text, (step) => {
        setCurrentSteps((prev) => [...prev, step]);
      });
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setCurrentSteps([]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentSteps]);

  // Initial prompt execution on mount if empty
  useEffect(() => {
    if (messages.length === 0) {
      handleSend('Can I afford a Honda Civic?');
    }
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">MoneyLens AI</h1>
            <Badge variant="success" className="font-mono text-[10px]">
              Autonomous Financial Intelligence
            </Badge>
          </div>
          <p className="text-sm text-neutral-400">
            Grounded banking agent executing deterministic financial tools. Never hallucinating numbers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] font-mono border-white/[0.08] text-neutral-400">
            Model: Gemini 3.8 Flash • Banking Agent
          </Badge>
        </div>
      </div>

      {/* Suggested Prompts Grid */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
          Suggested Financial Queries
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {suggestedPrompts.map((p) => (
            <button
              key={p.label}
              onClick={() => handleSend(p.label)}
              className="p-3 rounded-xl bg-neutral-900/60 border border-white/[0.06] hover:border-emerald-500/40 hover:bg-neutral-800/80 transition-all text-left group"
            >
              <span className="text-[10px] font-mono text-emerald-400 block uppercase tracking-wider mb-1">
                {p.tag}
              </span>
              <span className="text-xs font-medium text-neutral-200 group-hover:text-emerald-300 block line-clamp-2">
                "{p.label}"
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Financial Intelligence Feed */}
      <div className="fintech-card rounded-2xl p-4 sm:p-6 min-h-[480px] flex flex-col justify-between space-y-6">
        <div className="space-y-8">
          {messages.map((msg, index) => (
            <div key={index} className="space-y-4">
              {/* User Query Banner */}
              <div className="flex justify-end">
                <div className="p-3.5 px-5 rounded-2xl rounded-tr-sm bg-neutral-800/90 border border-white/[0.08] text-neutral-100 text-sm font-medium shadow-md">
                  {msg.query}
                </div>
              </div>

              {/* Agent Structured Financial Response */}
              <div className="rounded-2xl fintech-card p-6 space-y-5 border border-white/[0.08] bg-neutral-950/90">
                {/* Agent Header & Tools Executed */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-100 block">
                        MoneyLens Financial Evaluation
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        Verified via {msg.steps.length} Banking Tools
                      </span>
                    </div>
                  </div>

                  {/* Concise tool checkmarks */}
                  <div className="flex flex-wrap items-center gap-2">
                    {msg.steps.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1 text-[10px] font-mono bg-neutral-900 border border-white/[0.06] px-2 py-0.5 rounded-md text-neutral-300"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                        <span>{s.toolName}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* EXECUTIVE SUMMARY */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                    Financial Verdict
                  </span>
                  <p className="text-base sm:text-lg font-bold text-neutral-100 leading-snug">
                    {msg.structuredAnswer.summary}
                  </p>
                </div>

                {/* KEY GROUNDED NUMBERS GRID */}
                {msg.structuredAnswer.keyNumbers.length > 0 && (
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block mb-3">
                      Grounded Ledger Figures
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {msg.structuredAnswer.keyNumbers.map((num, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border ${
                            num.highlight
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                              : 'bg-neutral-950/80 border-white/[0.06] text-neutral-200'
                          }`}
                        >
                          <span className="text-[10px] text-neutral-400 block truncate font-sans">
                            {num.label}
                          </span>
                          <span className="font-mono font-bold text-xs sm:text-sm mt-1 block truncate num-tabular">
                            {num.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* UNDERLYING CAUSATION & WHY */}
                <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/[0.06] space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                    Underlying Financial Causation
                  </span>
                  <p className="text-neutral-300 leading-relaxed">
                    {msg.structuredAnswer.why}
                  </p>
                </div>

                {/* IMPACT ON GOALS & SAFETY BUFFER */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1 text-xs text-neutral-300">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold block">
                    Reserve & Goal Impact
                  </span>
                  <p className="leading-relaxed">
                    {msg.structuredAnswer.impact}
                  </p>
                </div>

                {/* ACTIONABLE OPTIONS / SIMULATOR HOOKS */}
                {msg.structuredAnswer.options.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                      Recommended Strategic Moves
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.structuredAnswer.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (
                              opt.label.toLowerCase().includes('what-if') ||
                              opt.label.toLowerCase().includes('simulate') ||
                              opt.label.toLowerCase().includes('installment')
                            ) {
                              onNavigate('simulator');
                            } else if (
                              opt.label.toLowerCase().includes('receipt') ||
                              opt.label.toLowerCase().includes('transaction')
                            ) {
                              onNavigate('transactions');
                            } else if (opt.label.toLowerCase().includes('goal') || opt.label.toLowerCase().includes('fees')) {
                              onNavigate('goals');
                            } else {
                              onNavigate('simulator');
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-emerald-500/30 hover:border-emerald-400 hover:bg-neutral-800 text-neutral-200 hover:text-emerald-300 text-xs font-medium transition-all flex items-center gap-2 group"
                        >
                          <span>{opt.label}</span>
                          <ArrowRight className="h-3 w-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Real-time Tool Activity Indicator when loading */}
          {isLoading && (
            <div className="rounded-2xl fintech-card p-5 space-y-3 text-xs font-mono animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="uppercase tracking-wider">
                  MoneyLens Autonomous Banking Pipeline Active
                </span>
              </div>

              <div className="space-y-1.5 pl-2 pt-1">
                {currentSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2 text-neutral-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 font-bold">[{step.toolName}]</span>
                    <span className="text-neutral-400">{step.statusText}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-neutral-500 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Synthesizing deterministic response against live accounts...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-white/[0.06]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything (e.g. Can I afford a Honda Civic? Why did my food spending surge?)"
              className="flex-1 bg-neutral-950/90 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/60 shadow-inner"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !inputValue.trim()}
              className="h-11 px-5 gap-2 font-semibold shadow-lg shadow-emerald-950/40"
            >
              <span>Ask AI</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 px-1">
            <span>Deterministic financial tools engine. Never guessing or hallucinating numbers.</span>
            <span className="font-mono text-emerald-400">Gemini 3.8 Flash Core</span>
          </div>
        </div>
      </div>
    </div>
  );
};
