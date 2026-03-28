'use client';

import { useState } from 'react';

export default function FlipCalculator() {
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);

  const tax = Math.floor(sellPrice * 0.10);
  const profit = sellPrice - tax - buyPrice;
  const margin = buyPrice > 0 ? ((profit / buyPrice) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
      <h3 className="font-heading font-semibold text-text-primary mb-4">Flip Calculator</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-text-secondary text-sm mb-1">Your Buy Price</label>
          <input
            type="number"
            value={buyPrice || ''}
            onChange={(e) => setBuyPrice(Number(e.target.value))}
            placeholder="0"
            className="w-full bg-bg-surface border border-border-default rounded-lg px-3 py-2 font-mono text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none"
          />
        </div>
        <div>
          <label className="block text-text-secondary text-sm mb-1">Your Sell Price</label>
          <input
            type="number"
            value={sellPrice || ''}
            onChange={(e) => setSellPrice(Number(e.target.value))}
            placeholder="0"
            className="w-full bg-bg-surface border border-border-default rounded-lg px-3 py-2 font-mono text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-text-secondary text-xs mb-1">Tax (10%)</div>
          <div className="font-mono font-bold text-warning">{tax.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-text-secondary text-xs mb-1">Profit</div>
          <div className={`font-mono font-bold ${profit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {profit.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-text-secondary text-xs mb-1">Margin</div>
          <div className={`font-mono font-bold ${profit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {margin}%
          </div>
        </div>
      </div>
    </div>
  );
}
