import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  Sparkles,
  Target,
  SlidersHorizontal,
  Bot,
  Settings,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { NavItem } from '@/src/types/navigation';
import { Badge } from '@/src/components/ui/badge';
import { cn } from '@/src/lib/utils';

interface NavbarProps {
  currentTab: NavItem;
  onTabChange: (tab: NavItem) => void;
  onShowLanding: () => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onShowLanding,
}) => {
  const navItems = [
    { id: 'dashboard' as NavItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as NavItem, label: 'Transactions', icon: ReceiptText },
    { id: 'insights' as NavItem, label: 'Insights', icon: Sparkles, badge: 'Live' },
    { id: 'goals' as NavItem, label: 'Milestones', icon: Target },
    { id: 'simulator' as NavItem, label: 'What-If', icon: SlidersHorizontal },
    { id: 'agent' as NavItem, label: 'MoneyLens AI', icon: Bot, highlight: true },
    { id: 'settings' as NavItem, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-neutral-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Modern Minimalist Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onShowLanding}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            {/* Sleek Minimalist Aperture Lens Logo */}
            <div className="h-9 w-9 rounded-xl bg-neutral-900 border border-white/[0.1] group-hover:border-emerald-500/50 flex items-center justify-center transition-all duration-200 shadow-sm relative overflow-hidden">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-emerald-400 transition-transform group-hover:scale-105"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" className="stroke-white/20" />
                <circle cx="12" cy="12" r="4" className="stroke-emerald-400 fill-emerald-500/10" />
                <path d="M12 3v3" className="stroke-emerald-400" />
                <path d="M12 18v3" className="stroke-emerald-400" />
                <path d="M3 12h3" className="stroke-emerald-400" />
                <path d="M18 12h3" className="stroke-emerald-400" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold tracking-tight text-neutral-100 text-base">
                  MONEY<span className="text-emerald-400">LENS</span>
                </span>
              </div>
              <span className="text-[9px] text-neutral-400 tracking-wider uppercase font-mono block">
                Banking Intelligence
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all',
                  isActive
                    ? 'bg-neutral-800 text-neutral-100 border border-white/[0.12] shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60',
                  item.highlight && !isActive && 'text-emerald-400 hover:text-emerald-300'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-emerald-400' : 'text-neutral-500')} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account & Quick Action */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs bg-neutral-900/80 border border-white/[0.08] px-3 py-1.5 rounded-xl font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-200 font-semibold">Ali Khan</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">PKR •••• 0918</span>
          </div>

          <button
            onClick={() => onTabChange('agent')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all shadow-md shadow-emerald-950/40"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Ask MoneyLens AI</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Scrolling Navigation */}
      <div className="lg:hidden overflow-x-auto py-2.5 px-4 border-t border-white/[0.06] flex items-center space-x-2 scrollbar-none bg-neutral-950/90">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors shrink-0',
                isActive
                  ? 'bg-neutral-800 text-neutral-100 border border-white/[0.12] shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900/60 border border-white/[0.04]'
              )}
            >
              <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-emerald-400' : 'text-neutral-500')} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
