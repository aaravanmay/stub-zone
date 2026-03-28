'use client';

import { useState } from 'react';
import { RARITY_COLORS } from '@/lib/constants';

const ODDS: [string, number][] = [
  ['Common', 0.40], ['Bronze', 0.40], ['Silver', 0.15], ['Gold', 0.04], ['Diamond', 0.01],
];

const AVG_VALUES: Record<string, number> = {
  Common: 25, Bronze: 50, Silver: 200, Gold: 1500, Diamond: 15000,
};

function rollPack(): string {
  const r = Math.random();
  let cum = 0;
  for (const [rarity, prob] of ODDS) {
    cum += prob;
    if (r <= cum) return rarity;
  }
  return 'Common';
}

export default function PackSimulator() {
  const [revealed, setRevealed] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [history, setHistory] = useState<Record<string, number>>({ Common: 0, Bronze: 0, Silver: 0, Gold: 0, Diamond: 0 });
  const [totalOpened, setTotalOpened] = useState(0);
  const [bestPull, setBestPull] = useState<string>('None');

  const openPack = () => {
    setIsFlipping(true);
    setRevealed(null);
    setTimeout(() => {
      const result = rollPack();
      setRevealed(result);
      setIsFlipping(false);
      setHistory(prev => ({ ...prev, [result]: prev[result] + 1 }));
      setTotalOpened(prev => prev + 1);
      const order = ['Common', 'Bronze', 'Silver', 'Gold', 'Diamond'];
      if (order.indexOf(result) > order.indexOf(bestPull === 'None' ? 'Common' : bestPull)) setBestPull(result);
    }, 600);
  };

  const openMany = (count: number) => {
    const results: Record<string, number> = { Common: 0, Bronze: 0, Silver: 0, Gold: 0, Diamond: 0 };
    let best = bestPull;
    const order = ['Common', 'Bronze', 'Silver', 'Gold', 'Diamond'];
    for (let i = 0; i < count; i++) {
      const r = rollPack();
      results[r]++;
      if (order.indexOf(r) > order.indexOf(best === 'None' ? 'Common' : best)) best = r;
    }
    setHistory(prev => {
      const next = { ...prev };
      Object.entries(results).forEach(([k, v]) => { next[k] = (next[k] || 0) + v; });
      return next;
    });
    setTotalOpened(prev => prev + count);
    setBestPull(best);
    setRevealed(null);
  };

  const totalValue = Object.entries(history).reduce((s, [r, c]) => s + (AVG_VALUES[r] || 0) * c, 0);
  const totalCost = totalOpened * 1000;

  const rarityColor = revealed ? (RARITY_COLORS[revealed as keyof typeof RARITY_COLORS]?.dot || '#5a6e8a') : '#5a6e8a';

  return (
    <div>
      {/* Pack Card */}
      <div className="flex flex-col items-center mb-8">
        <div
          className={`w-48 h-64 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 mb-4 ${isFlipping ? 'animate-spin' : ''}`}
          style={{
            borderColor: revealed ? rarityColor : 'rgba(255,255,255,0.1)',
            boxShadow: revealed ? `0 0 30px ${rarityColor}40` : 'none',
            background: revealed ? `linear-gradient(135deg, #111a2e, ${rarityColor}20)` : '#111a2e',
          }}
        >
          {revealed ? (
            <div className="text-center">
              <div className="text-4xl mb-2">{revealed === 'Diamond' ? '💎' : revealed === 'Gold' ? '🥇' : revealed === 'Silver' ? '🥈' : revealed === 'Bronze' ? '🥉' : '⚾'}</div>
              <div className="font-heading font-bold text-lg" style={{ color: rarityColor }}>{revealed}</div>
              <div className="font-mono text-sm text-text-secondary mt-1">~{AVG_VALUES[revealed]?.toLocaleString()} stubs</div>
            </div>
          ) : (
            <div className="text-text-tertiary text-center">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-sm">Standard Pack</div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={openPack} disabled={isFlipping}
            className="px-6 py-3 bg-accent-primary text-bg-primary rounded-xl font-heading font-bold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50">
            Open Pack
          </button>
          <button onClick={() => openMany(10)} className="px-4 py-3 border border-border-default text-text-secondary rounded-xl text-sm hover:border-accent-primary transition-colors">Open 10</button>
          <button onClick={() => openMany(100)} className="px-4 py-3 border border-border-default text-text-secondary rounded-xl text-sm hover:border-accent-primary transition-colors">Open 100</button>
        </div>
      </div>

      {/* Stats */}
      {totalOpened > 0 && (
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
          <h3 className="font-heading font-semibold text-text-primary mb-4">Session Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {Object.entries(history).map(([rarity, count]) => (
              <div key={rarity} className="text-center p-2 rounded-lg bg-bg-tertiary">
                <div className="text-xs text-text-secondary">{rarity}</div>
                <div className="font-mono font-bold text-text-primary">{count}</div>
                <div className="text-xs text-text-tertiary">{totalOpened > 0 ? ((count / totalOpened) * 100).toFixed(1) : 0}%</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center"><div className="text-text-tertiary text-xs">Packs Opened</div><div className="font-mono font-bold text-text-primary">{totalOpened}</div></div>
            <div className="text-center"><div className="text-text-tertiary text-xs">Total Value</div><div className="font-mono font-bold text-profit">{totalValue.toLocaleString()}</div></div>
            <div className="text-center"><div className="text-text-tertiary text-xs">Total Cost</div><div className="font-mono font-bold text-loss">{totalCost.toLocaleString()}</div></div>
            <div className="text-center"><div className="text-text-tertiary text-xs">Net</div><div className={`font-mono font-bold ${totalValue - totalCost >= 0 ? 'text-profit' : 'text-loss'}`}>{(totalValue - totalCost).toLocaleString()}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}
