'use client';

import { Listing } from '@/lib/types';

interface Props {
  cards: Listing[];
  targetPoints: number;
  tierName: string;
}

function getExchangePoints(ovr: number, rarity: string): number {
  const base = rarity === 'Diamond' ? 5000 : rarity === 'Gold' ? 1000 : rarity === 'Silver' ? 250 : rarity === 'Bronze' ? 100 : 25;
  return base + Math.max(0, ovr - 60) * 10;
}

export default function ExchangeCalc({ cards, targetPoints, tierName }: Props) {
  const withPoints = cards.map(l => {
    const points = getExchangePoints(l.item.ovr, l.item.rarity);
    const costPerPoint = l.best_buy_price / Math.max(points, 1);
    return { ...l, points, costPerPoint };
  }).sort((a, b) => a.costPerPoint - b.costPerPoint);

  let remaining = targetPoints;
  let totalCost = 0;
  let totalCards = 0;
  const recommended: typeof withPoints = [];

  for (const card of withPoints) {
    if (remaining <= 0) break;
    const needed = Math.ceil(remaining / card.points);
    const use = Math.min(needed, 20);
    recommended.push(card);
    remaining -= card.points * use;
    totalCost += card.best_buy_price * use;
    totalCards += use;
  }

  return (
    <div>
      <div className="bg-bg-secondary border border-accent-primary/20 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-text-primary font-heading font-semibold">{tierName} Exchange</span>
          <div className="text-right">
            <div className="font-mono font-bold text-accent-primary text-lg">{totalCost.toLocaleString()} stubs</div>
            <div className="text-text-tertiary text-xs">{totalCards} cards needed</div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              {['Card', 'OVR', 'Buy Price', 'Points', 'Cost/Point'].map(h => (
                <th key={h} className="p-2 text-xs text-text-secondary uppercase text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {withPoints.slice(0, 20).map(c => (
              <tr key={c.item.uuid} className="border-b border-border-subtle/50 odd:bg-white/[0.02]">
                <td className="p-2 flex items-center gap-2">
                  <img src={c.item.img} alt="" className="w-8 h-8 rounded object-cover bg-bg-tertiary" loading="lazy" />
                  <span className="text-text-primary text-sm">{c.item.name}</span>
                </td>
                <td className="p-2 font-mono text-sm">{c.item.ovr}</td>
                <td className="p-2 font-mono text-sm">{c.best_buy_price.toLocaleString()}</td>
                <td className="p-2 font-mono text-sm">{c.points}</td>
                <td className="p-2 font-mono text-sm text-accent-primary">{c.costPerPoint.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
