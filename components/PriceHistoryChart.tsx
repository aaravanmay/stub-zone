'use client';

import { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';

interface PricePoint {
  date: string;
  best_buy_price: number;
  best_sell_price: number;
}

interface Props {
  priceHistory: PricePoint[];
}

export default function PriceHistoryChart({ priceHistory }: Props) {
  const [range, setRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  const filteredData = useMemo(() => {
    if (!priceHistory?.length) return [];
    const now = Date.now();
    const ranges: Record<string, number> = { '24h': 86400000, '7d': 604800000, '30d': 2592000000 };
    const cutoff = range === 'all' ? 0 : now - ranges[range];
    return priceHistory
      .filter(p => new Date(p.date).getTime() > cutoff)
      .map(p => ({
        date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        buy: p.best_buy_price,
        sell: p.best_sell_price,
      }));
  }, [priceHistory, range]);

  if (!priceHistory?.length) {
    return (
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-8 text-center text-text-secondary">
        No price history available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-bg-surface border border-border-default rounded-lg p-3 shadow-xl">
        <div className="text-text-secondary text-xs mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-text-secondary">{p.dataKey === 'buy' ? 'Buy' : 'Sell'}:</span>
            <span className="font-mono font-semibold text-text-primary">{p.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex gap-1.5 mb-4">
        {(['24h', '7d', '30d', 'all'] as const).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${range === r ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="buyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#118ab2" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#118ab2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sellGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#06d6a0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fill: '#4a5e80', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#4a5e80', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v.toLocaleString()} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="buy" stroke="#118ab2" fill="url(#buyGrad)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="sell" stroke="#06d6a0" fill="url(#sellGrad)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
