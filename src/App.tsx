import React, { useState } from 'react';
import { NavItem } from '@/src/types/navigation';
import { Navbar } from '@/src/components/layout/Navbar';
import { LandingPageView } from '@/src/features/landing/LandingPageView';
import { SettingsPage } from '@/src/pages/SettingsPage';
import { DashboardView } from '@/src/features/dashboard/DashboardView';
import { TransactionsView } from '@/src/features/transactions/TransactionsView';
import { GoalsView } from '@/src/features/goals/GoalsView';
import { InsightsView } from '@/src/features/insights/InsightsView';
import { SimulatorView } from '@/src/features/simulator/SimulatorView';
import { AgentView } from '@/src/features/agent/AgentView';
import { useFinanceData } from '@/src/hooks/useFinanceData';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<NavItem>('dashboard');
  const { resetDemoData } = useFinanceData();

  const handleResetDemo = () => {
    resetDemoData();
  };

  const handleEnterApp = (targetTab: NavItem = 'dashboard') => {
    setViewMode('app');
    setCurrentTab(targetTab);
  };

  if (viewMode === 'landing') {
    return <LandingPageView onEnterApp={handleEnterApp} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onShowLanding={() => setViewMode('landing')}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-150">
        {currentTab === 'dashboard' && (
          <DashboardView onNavigate={(tab) => setCurrentTab(tab)} />
        )}

        {currentTab === 'transactions' && (
          <TransactionsView />
        )}

        {currentTab === 'insights' && (
          <InsightsView onNavigate={(tab) => setCurrentTab(tab)} />
        )}

        {currentTab === 'goals' && (
          <GoalsView />
        )}

        {currentTab === 'simulator' && (
          <SimulatorView onNavigate={(tab) => setCurrentTab(tab)} />
        )}

        {currentTab === 'agent' && (
          <AgentView onNavigate={(tab) => setCurrentTab(tab)} />
        )}

        {currentTab === 'settings' && (
          <SettingsPage onResetDemo={handleResetDemo} />
        )}
      </main>

      {/* Minimal App Footer */}
      <footer className="border-t border-white/[0.06] bg-neutral-950/80 py-5 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300">MoneyLens</span>
            <span>—</span>
            <span>Allied Bank Limited Integrated Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
            <button
              onClick={() => setViewMode('landing')}
              className="hover:text-emerald-400 transition-colors"
            >
              Overview
            </button>
            <span>•</span>
            <span className="text-emerald-400">Autonomous Financial Intelligence</span>
            <span>•</span>
            <span>Bank-Grade Precision</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
