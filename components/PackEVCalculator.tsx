'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface PackType {
  name: string;
  cost: number;
  odds: Record<string, number>;
  description: string;
  inShop: boolean;
}

const PACKS: PackType[] = [
  {
    name: 'The Show Pack',
    cost: 1500,
    odds: { Common: 0.35, Bronze: 0.35, Silver: 0.20, Gold: 0.08, Diamond: 0.02 },
    description: 'Basic pack available in the shop. 1 guaranteed player card.',
    inShop: true,
  },
  {
    name: 'Headliners Pack',
    cost: 7500,
    odds: { Silver: 0.45, Gold: 0.30, Diamond: 0.18, 'Red Diamond': 0.07 },
    description: 'Featured players with boosted Diamond odds. Rotates weekly.',
    inShop: true,
  },
  {
    name: "Ballin' is a Habit",
    cost: 25000,
    odds: { Gold: 0.45, Diamond: 0.40, 'Red Diamond': 0.15 },
    description: 'Premium pack with no cards below Gold. Best shot at high diamonds.',
    inShop: true,
  },
  {
    name: 'New Threads Pack',
    cost: 10000,
    odds: { Silver: 0.30, Gold: 0.35, Diamond: 0.25, 'Red Diamond': 0.10 },
    description: 'Contains New Threads series cards. New series drops regularly.',
    inShop: true,
  },
  {
    name: 'Chase Pack',
    cost: 15000,
    odds: { Gold: 0.40, Diamond: 0.35, 'Red Diamond': 0.20, 'Special': 0.05 },
    description: 'Chase rare collection rewards and limited edition cards.',
    inShop: true,
  },
  {
    name: 'Prospect Pack',
    cost: 5000,
    odds: { Bronze: 0.25, Silver: 0.35, Gold: 0.25, Diamond: 0.12, 'Red Diamond': 0.03 },
    description: 'Future Stars and Prospect series cards. Great value.',
    inShop: true,
  },
  {
    name: 'Team Affinity Pack',
    cost: 0,
    odds: { Silver: 0.30, Gold: 0.40, Diamond: 0.25, 'Red Diamond': 0.05 },
    description: 'Earned from Team Affinity programs. Not purchasable.',
    inShop: false,
  },
  {
    name: 'Conquest Reward Pack',
    cost: 0,
    odds: { Bronze: 0.30, Silver: 0.30, Gold: 0.25, Diamond: 0.12, 'Red Diamond': 0.03 },
    description: 'Earned from Conquest map hidden rewards.',
    inShop: false,
  },
];

export default function PackEVCalculator() {
  const [avgPrices, setAvgPrices] = useState<Record<string, number>>({
    Common: 25, Bronze: 50, Silver: 200, Gold: 1500, Diamond: 15000, 'Red Diamond': 100000, 'Special': 250000,
  });
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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

  const displayPacks = showAll ? PACKS : PACKS.filter(p => p.inShop);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setShowAll(false)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${!showAll ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
          Shop Packs
        </button>
        <button onClick={() => setShowAll(true)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${showAll ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
          All Packs (incl. Earned)
        </button>
      </div>

      {loading && (
        <div className="text-text-secondary text-sm mb-4">Loading live market prices for accurate EV...</div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayPacks.map(pack => {
          const ev = Object.entries(pack.odds).reduce((sum, [rarity, prob]) => sum + prob * (avgPrices[rarity] || 0), 0);
          const ratio = pack.cost > 0 ? ev / pack.cost : Infinity;
          const isBuy = ratio >= 1;

          return (
            <div key={pack.name} className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-heading font-semibold text-text-primary">{pack.name}</h3>
                {!pack.inShop && (
                  <span className="text-xs px-2 py-0.5 bg-accent-primary/10 text-accent-primary rounded-full">Earned</span>
                )}
              </div>
              <div className="font-mono text-text-secondary text-sm mb-2">
                {pack.cost > 0 ? `${pack.cost.toLocaleString()} stubs` : 'Free (earned)'}
              </div>
              <p className="text-text-tertiary text-xs mb-4">{pack.description}</p>

              <div className="space-y-1.5 mb-4">
                {Object.entries(pack.odds).map(([rarity, prob]) => (
                  <div key={rarity} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{rarity}</span>
                    <div className="flex gap-3">
                      <span className="font-mono text-text-tertiary">{(prob * 100).toFixed(0)}%</span>
                      <span className="font-mono text-text-tertiary w-16 text-right">{(avgPrices[rarity] || 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-subtle pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary text-sm">Expected Value</span>
                  <span className="font-mono font-bold text-text-primary">{Math.round(ev).toLocaleString()}</span>
                </div>
                {pack.cost > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-text-secondary text-sm">EV / Cost</span>
                      <span className={`font-mono font-bold ${isBuy ? 'text-profit' : 'text-loss'}`}>{(ratio * 100).toFixed(0)}%</span>
                    </div>
                    <div className={`flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm ${isBuy ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'}`}>
                      {isBuy ? <><Check size={16} /> Worth buying</> : <><X size={16} /> Skip, flip instead</>}
                    </div>
                  </>
                )}
                {pack.cost === 0 && (
                  <div className="flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm bg-profit/10 text-profit">
                    <Check size={16} /> Free value: {Math.round(ev).toLocaleString()} stubs
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
