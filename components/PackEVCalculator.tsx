'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface PackType {
  name: string;
  cost: number;
  odds: Record<string, number>;
}

const PACKS: PackType[] = [
  { name: 'Standard Pack', cost: 1000, odds: { Common: 0.40, Bronze: 0.40, Silver: 0.15, Gold: 0.04, Diamond: 0.01 } },
  { name: 'Headliner Pack', cost: 7500, odds: { Silver: 0.50, Gold: 0.30, Diamond: 0.15, 'Red Diamond': 0.05 } },
  { name: "Ballin' is a Habit", cost: 25000, odds: { Gold: 0.50, Diamond: 0.40, 'Red Diamond': 0.10 } },
];

export default function PackEVCalculator() {
  const [avgPrices, setAvgPrices] = useState<Record<string, number>>({
    Common: 25, Bronze: 50, Silver: 200, Gold: 1500, Diamond: 15000, 'Red Diamond': 100000
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      const rarities = ['common', 'bronze', 'silver', 'gold', 'diamond'];
      const results: Record<string, number> = {};
      await Promise.all(rarities.map(async (r) => {
        try {
          const res = await fetch(`/api/listings?type=mlb_card&rarity=${r}&page=1`);
          const data = await res.json();
          const listings = data.listings || [];
          const avg = listings.length ? Math.round(listings.reduce((s: number, l: any) => s + l.best_sell_price, 0) / listings.length) : 0;
          results[r.charAt(0).toUpperCase() + r.slice(1)] = avg;
        } catch {}
      }));
      if (Object.keys(results).length > 0) {
        setAvgPrices(prev => ({ ...prev, ...results }));
      }
      setLoading(false);
    };
    fetchPrices();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PACKS.map(pack => {
        const ev = Object.entries(pack.odds).reduce((sum, [rarity, prob]) => sum + prob * (avgPrices[rarity] || 0), 0);
        const ratio = ev / pack.cost;
        const isBuy = ratio >= 1;

        return (
          <div key={pack.name} className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
            <h3 className="font-heading font-semibold text-text-primary mb-1">{pack.name}</h3>
            <div className="font-mono text-text-secondary text-sm mb-4">{pack.cost.toLocaleString()} stubs</div>

            <div className="space-y-1.5 mb-4">
              {Object.entries(pack.odds).map(([rarity, prob]) => (
                <div key={rarity} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{rarity}</span>
                  <span className="font-mono text-text-tertiary">{(prob * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border-subtle pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">Expected Value</span>
                <span className="font-mono font-bold text-text-primary">{Math.round(ev).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary text-sm">EV / Cost</span>
                <span className={`font-mono font-bold ${isBuy ? 'text-profit' : 'text-loss'}`}>{(ratio * 100).toFixed(0)}%</span>
              </div>
              <div className={`flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm ${isBuy ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'}`}>
                {isBuy ? <><Check size={16} /> Buy this pack</> : <><X size={16} /> Skip, flip instead</>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
