'use client';

import { useState, useEffect, useMemo } from 'react';
import { Item, Listing } from '@/lib/types';
import RarityBadge from './RarityBadge';

interface Props {
  team: Record<string, Item | null>;
}

const BUDGET_TIERS = [
  { label: 'Under 5K', max: 5000 },
  { label: 'Under 25K', max: 25000 },
  { label: 'Under 100K', max: 100000 },
  { label: 'Unlimited', max: Infinity },
];

export default function UpgradeAdvisor({ team }: Props) {
  const [budgetTier, setBudgetTier] = useState(1);
  const [upgrades, setUpgrades] = useState<Record<string, Listing[]>>({});
  const [loading, setLoading] = useState(false);

  const filledPositions = useMemo(
    () => Object.entries(team).filter(([, p]) => p !== null) as [string, Item][],
    [team]
  );

  const hasEnough = filledPositions.length >= 3;

  const avgOVR = hasEnough
    ? Math.round(filledPositions.reduce((s, [, p]) => s + p.ovr, 0) / filledPositions.length)
    : 0;

  const weakest = hasEnough
    ? filledPositions.reduce((min, cur) => cur[1].ovr < min[1].ovr ? cur : min)
    : null;

  const avgStats = hasEnough
    ? {
        Contact: Math.round(filledPositions.reduce((s, [, p]) => s + ((p.contact_right || 0) + (p.contact_left || 0)) / 2, 0) / filledPositions.length),
        Power: Math.round(filledPositions.reduce((s, [, p]) => s + ((p.power_right || 0) + (p.power_left || 0)) / 2, 0) / filledPositions.length),
        Speed: Math.round(filledPositions.reduce((s, [, p]) => s + (p.speed || 0), 0) / filledPositions.length),
        Fielding: Math.round(filledPositions.reduce((s, [, p]) => s + (p.fielding || 0), 0) / filledPositions.length),
      }
    : { Contact: 0, Power: 0, Speed: 0, Fielding: 0 };

  const lowestStat = Object.entries(avgStats).reduce((min, cur) => cur[1] < min[1] ? cur : min);

  useEffect(() => {
    if (!hasEnough) return;
    const fetchUpgrades = async () => {
      setLoading(true);
      const results: Record<string, Listing[]> = {};
      const positions = filledPositions.slice(0, 8);
      await Promise.all(positions.map(async ([slot, player]) => {
        const pos = slot.replace(/\d+$/, '');
        try {
          const params = new URLSearchParams({
            type: 'mlb_card', display_position: pos, sort: 'rank', order: 'desc',
          });
          if (BUDGET_TIERS[budgetTier].max < Infinity) {
            params.set('max_best_buy_price', String(BUDGET_TIERS[budgetTier].max));
          }
          const res = await fetch(`/api/listings?${params}`);
          const data = await res.json();
          results[slot] = (data.listings || []).filter((l: Listing) => l.item.ovr > player.ovr).slice(0, 3);
        } catch { results[slot] = []; }
      }));
      setUpgrades(results);
      setLoading(false);
    };
    fetchUpgrades();
  }, [budgetTier, hasEnough, filledPositions]);

  if (!hasEnough) {
    return (
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-8 text-center text-text-secondary">
        Fill at least 3 positions to get upgrade suggestions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold text-text-primary">Upgrade Advisor</h2>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-3 text-center">
          <div className="text-text-tertiary text-xs">Team OVR</div>
          <div className="font-mono font-bold text-2xl text-accent-primary">{avgOVR}</div>
        </div>
        {Object.entries(avgStats).map(([k, v]) => (
          <div key={k} className={`bg-bg-secondary border rounded-xl p-3 text-center ${k === lowestStat[0] ? 'border-loss/40' : 'border-border-subtle'}`}>
            <div className="text-text-tertiary text-xs">{k}</div>
            <div className={`font-mono font-bold text-xl ${k === lowestStat[0] ? 'text-loss' : 'text-text-primary'}`}>{v}</div>
          </div>
        ))}
        {weakest && (
          <div className="bg-bg-secondary border border-loss/40 rounded-xl p-3 text-center">
            <div className="text-text-tertiary text-xs">Weakest</div>
            <div className="text-loss font-semibold text-sm">{weakest[0]}</div>
            <div className="font-mono text-loss text-xs">{weakest[1].ovr} OVR</div>
          </div>
        )}
      </div>

      {/* Budget Filter */}
      <div className="flex gap-1.5">
        {BUDGET_TIERS.map((t, i) => (
          <button key={t.label} onClick={() => setBudgetTier(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${budgetTier === i ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Upgrades */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-bg-tertiary rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-4">
          {filledPositions.map(([slot, player]) => {
            const slotUpgrades = upgrades[slot] || [];
            if (slotUpgrades.length === 0) return null;
            return (
              <div key={slot} className="bg-bg-secondary border border-border-subtle rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-text-secondary text-xs font-medium uppercase">{slot}</span>
                  <span className="text-text-tertiary text-xs">Current: {player.name} ({player.ovr} OVR)</span>
                </div>
                <div className="grid gap-2">
                  {slotUpgrades.map(l => {
                    const ovrGain = l.item.ovr - player.ovr;
                    return (
                      <div key={l.item.uuid} className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
                        <img src={l.item.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-bg-tertiary" />
                        <div className="flex-1 min-w-0">
                          <div className="text-text-primary text-sm font-medium truncate">{l.item.name}</div>
                          <RarityBadge rarity={l.item.rarity} />
                        </div>
                        <div className="font-mono font-bold text-text-primary">{l.item.ovr}</div>
                        <div className="text-profit text-xs font-mono">+{ovrGain}</div>
                        <div className="font-mono text-sm text-text-secondary">{l.best_buy_price.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
