'use client';

import { FlipLogEntry } from '@/lib/types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  flipLog: FlipLogEntry[];
  stats: { totalProfit: number; todayProfit: number; weekProfit: number; totalFlips: number; avgProfit: number; bestFlip: FlipLogEntry | null };
}

export default function ProfitTracker({ flipLog, stats }: Props) {
  const sortedLog = [...flipLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let cumulative = 0;
  const chartData = sortedLog.map(f => {
    cumulative += f.profit;
    return { date: new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), profit: cumulative };
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Profit', value: stats.totalProfit, color: 'text-profit' },
          { label: "Today's Profit", value: stats.todayProfit, color: 'text-accent-primary' },
          { label: "This Week", value: stats.weekProfit, color: 'text-accent-primary' },
          { label: 'Total Flips', value: stats.totalFlips, color: 'text-text-primary', noFormat: true },
          { label: 'Avg Profit', value: stats.avgProfit, color: 'text-text-primary' },
          { label: 'Best Flip', value: stats.bestFlip?.profit || 0, color: 'text-warning' },
        ].map(s => (
          <div key={s.label} className="bg-bg-secondary border border-border-subtle rounded-xl p-3 text-center">
            <div className="text-text-tertiary text-xs mb-0.5">{s.label}</div>
            <div className={`font-mono font-bold text-lg ${s.color}`}>
              {(s as any).noFormat ? s.value : s.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 1 ? (
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
          <h3 className="font-heading font-semibold text-text-primary mb-4">Cumulative Profit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06d6a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#4a5e80', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a5e80', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v.toLocaleString()} />
              <Tooltip contentStyle={{ background: '#1a2744', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e8edf5' }} />
              <Area type="monotone" dataKey="profit" stroke="#06d6a0" fill="url(#profitGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-8 text-center text-text-secondary">
          Log your first flip to see your profit chart!
        </div>
      )}
    </div>
  );
}
