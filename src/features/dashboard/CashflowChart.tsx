import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { CashFlowPoint } from '@/src/types/finance';
import { formatPKR } from '@/src/lib/utils';

interface CashflowChartProps {
  timeline: CashFlowPoint[];
  referenceDate: string;
}

export const CashflowChart: React.FC<CashflowChartProps> = ({ timeline, referenceDate }) => {
  // Sample every 3-4 days to keep chart uncluttered while maintaining trend fidelity
  const chartData = timeline
    .filter((_, idx) => idx % 3 === 0 || idx === timeline.length - 1)
    .map((pt) => ({
      ...pt,
      displayDate: new Date(pt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      historicalBalance: !pt.isProjected ? pt.balance : null,
      projectedBalance: pt.isProjected ? pt.balance : null,
    }));

  // Bridge point for continuous visual line
  const switchIndex = chartData.findIndex((d) => d.isProjected);
  if (switchIndex > 0) {
    chartData[switchIndex - 1].projectedBalance = chartData[switchIndex - 1].balance;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CashFlowPoint & { displayDate: string };
      return (
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-semibold text-neutral-200">{data.displayDate} ({data.date})</div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-neutral-400">Balance:</span>
            <span className="font-mono font-bold text-emerald-400">{formatPKR(data.balance)}</span>
          </div>
          {data.isProjected && (
            <div className="text-[10px] text-teal-400 font-mono">
              [Projected Forecast]
            </div>
          )}
          {data.eventDescription && (
            <div className="text-[11px] text-neutral-300 pt-1 border-t border-neutral-800 font-mono">
              {data.eventDescription}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="displayDate"
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#27272a' }}
          />
          <YAxis
            stroke="#71717a"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `PKR ${(val / 1000).toFixed(0)}k`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            x={new Date(referenceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: 'Today', fill: '#f59e0b', fontSize: 10, position: 'top' }}
          />
          {/* Historical Actual */}
          <Area
            type="monotone"
            dataKey="historicalBalance"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#historicalGrad)"
            isAnimationActive={false}
          />
          {/* Projected Forecast */}
          <Area
            type="monotone"
            dataKey="projectedBalance"
            stroke="#06b6d4"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#projectedGrad)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
