import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { CashFlowPoint } from '@/src/types/finance';
import { formatPKR } from '@/src/lib/utils';

interface SimulationChartProps {
  baselineTimeline: CashFlowPoint[];
  simulatedTimeline: CashFlowPoint[];
  reserveTarget?: number;
}

export const SimulationChart: React.FC<SimulationChartProps> = ({
  baselineTimeline,
  simulatedTimeline,
  reserveTarget = 100000,
}) => {
  // Combine timelines by date, sampling every 2-3 points
  const chartData = baselineTimeline
    .filter((_, idx) => idx % 2 === 0 || idx === baselineTimeline.length - 1)
    .map((base, idx) => {
      const sim = simulatedTimeline.find((s) => s.date === base.date) || base;
      return {
        date: base.date,
        displayDate: new Date(base.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        baseline: base.balance,
        simulated: sim.balance,
        delta: sim.balance - base.balance,
        event: sim.eventDescription || base.eventDescription,
      };
    });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg shadow-xl text-xs space-y-1.5 max-w-xs">
          <div className="font-semibold text-neutral-200 border-b border-neutral-800 pb-1">
            {data.displayDate} ({data.date})
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-emerald-400 font-medium">Current Baseline:</span>
            <span className="font-mono text-neutral-200 font-bold">{formatPKR(data.baseline)}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-cyan-400 font-medium">With Scenario:</span>
            <span className="font-mono text-cyan-300 font-bold">{formatPKR(data.simulated)}</span>
          </div>
          <div className="flex justify-between items-center gap-4 pt-1 border-t border-neutral-800">
            <span className="text-neutral-400">Difference:</span>
            <span className={`font-mono font-bold ${data.delta < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {data.delta !== 0 ? formatPKR(data.delta) : 'PKR 0'}
            </span>
          </div>
          {data.event && (
            <div className="text-[10px] text-amber-300/90 pt-1 font-mono">
              Event: {data.event}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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

          {/* Emergency Reserve Target Line */}
          <ReferenceLine
            y={reserveTarget}
            stroke="#f43f5e"
            strokeDasharray="4 4"
            label={{
              value: `Reserve Floor: ${formatPKR(reserveTarget, true)}`,
              fill: '#f43f5e',
              fontSize: 10,
              position: 'insideBottomRight',
            }}
          />

          {/* Baseline Curve */}
          <Line
            type="monotone"
            dataKey="baseline"
            name="Current Path"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />

          {/* Simulated Curve */}
          <Line
            type="monotone"
            dataKey="simulated"
            name="Simulated Path"
            stroke="#06b6d4"
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
