'use client';

import { useState } from 'react';

export default function FlipCalculator() {
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const tax = Math.floor(sellPrice * 0.10);
  const profitPerFlip = sellPrice - tax - buyPrice;
  const margin = buyPrice > 0 ? ((profitPerFlip / buyPrice) * 100).toFixed(1) : '0.0';
  const totalProfit = profitPerFlip * quantity;
  const totalInvestment = buyPrice * quantity;
  const roi = totalInvestment > 0 ? ((totalProfit / totalInvestment) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
      <h3 className="font-heading font-semibold text-text-primary mb-4">Flip Calculator</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-text-secondary text-sm mb-1">Buy Order Price</label>
          <input
            type="number"
            value={buyPrice || ''}
            onChange={(e) => setBuyPrice(Number(e.target.value))}
            placeholder="0"
            className="w-full bg-bg-surface border border-border-default rounded-lg px-3 py-2 font-mono text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none"
          />
          <span className="text-text-tertiary text-xs">What you pay per card</span>
        </div>
        <div>
          <label className="block text-text-secondary text-sm mb-1">Sell Order Price</label>
          <input
            type="number"
            value={sellPrice || ''}
            onChange={(e) => setSellPrice(Number(e.target.value))}
            placeholder="0"
            className="w-full bg-bg-surface border border-border-default rounded-lg px-3 py-2 font-mono text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none"
          />
          <span className="text-text-tertiary text-xs">What you list to sell at</span>
        </div>
        <div>
          <label className="block text-text-secondary text-sm mb-1">Quantity</label>
          <input
            type="number"
            value={quantity || ''}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            placeholder="1"
            min={1}
            className="w-full bg-bg-surface border border-border-default rounded-lg px-3 py-2 font-mono text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none"
          />
          <span className="text-text-tertiary text-xs">How many flips</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="text-center bg-bg-tertiary rounded-lg p-3">
          <div className="text-text-secondary text-xs mb-1">Tax (10%)</div>
          <div className="font-mono font-bold text-warning">{tax.toLocaleString()}</div>
        </div>
        <div className="text-center bg-bg-tertiary rounded-lg p-3">
          <div className="text-text-secondary text-xs mb-1">Profit / Flip</div>
          <div className={`font-mono font-bold ${profitPerFlip >= 0 ? 'text-profit' : 'text-loss'}`}>
            {profitPerFlip.toLocaleString()}
          </div>
        </div>
        <div className="text-center bg-bg-tertiary rounded-lg p-3">
          <div className="text-text-secondary text-xs mb-1">Margin</div>
          <div className={`font-mono font-bold ${profitPerFlip >= 0 ? 'text-profit' : 'text-loss'}`}>
            {margin}%
          </div>
        </div>
        <div className="text-center bg-bg-tertiary rounded-lg p-3">
          <div className="text-text-secondary text-xs mb-1">Total Profit</div>
          <div className={`font-mono font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfit.toLocaleString()}
          </div>
        </div>
        <div className="text-center bg-bg-tertiary rounded-lg p-3">
          <div className="text-text-secondary text-xs mb-1">ROI</div>
          <div className={`font-mono font-bold ${profitPerFlip >= 0 ? 'text-profit' : 'text-loss'}`}>
            {roi}%
          </div>
        </div>
      </div>
    </div>
  );
}
