'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface Mover {
  name: string;
  img: string;
  rarity: string;
  price: number;
  change: number;
  pctChange: number;
}

interface Props {
  gainers: Mover[];
  losers: Mover[];
}

function MoverRow({ m, rank }: { m: Mover; rank: number }) {
  const isGain = m.change >= 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-text-tertiary text-xs font-mono w-5">{rank}</span>
      <img src={m.img} alt="" className="w-8 h-8 rounded object-cover bg-bg-tertiary" />
      <div className="flex-1 min-w-0">
        <div className="text-text-primary text-sm truncate">{m.name}</div>
      </div>
      <span className="font-mono text-sm text-text-primary">{m.price.toLocaleString()}</span>
      <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-medium ${isGain ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'}`}>
        {isGain ? '+' : ''}{m.pctChange.toFixed(1)}%
      </span>
    </div>
  );
}

export default function MarketMovers({ gainers, losers }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-profit" />
          <h3 className="font-heading font-semibold text-text-primary">Top Gainers</h3>
        </div>
        {gainers.length > 0 ? gainers.map((m, i) => <MoverRow key={m.name + i} m={m} rank={i + 1} />) :
          <div className="text-text-secondary text-sm py-4">Tracking market changes...</div>}
      </div>
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown size={18} className="text-loss" />
          <h3 className="font-heading font-semibold text-text-primary">Top Losers</h3>
        </div>
        {losers.length > 0 ? losers.map((m, i) => <MoverRow key={m.name + i} m={m} rank={i + 1} />) :
          <div className="text-text-secondary text-sm py-4">Tracking market changes...</div>}
      </div>
    </div>
  );
}
