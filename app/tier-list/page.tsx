'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/lib/types';
import { ALL_POSITIONS } from '@/lib/constants';
import { calculateMetaScore } from '@/lib/calculations';
import MetaTierList from '@/components/MetaTierList';
import TierListCompare from '@/components/TierListCompare';

const BUDGET_TIERS = [
  { label: 'All', max: Infinity },
  { label: 'Under 5K', max: 5000 },
  { label: 'Under 25K', max: 25000 },
  { label: 'Under 100K', max: 100000 },
];

export default function TierListPage() {
  const [position, setPosition] = useState('C');
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [cards, setCards] = useState<(Listing & { metaScore: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      type: 'mlb_card', display_position: position, sort: 'rank', order: 'desc', page: '1',
    });
    if (BUDGET_TIERS[budgetIdx].max < Infinity) {
      params.set('max_best_buy_price', String(BUDGET_TIERS[budgetIdx].max));
    }
    fetch(`/api/listings?${params}`)
      .then(r => r.json())
      .then(data => {
        const listings: Listing[] = data.listings || [];
        const scored = listings.map(l => ({
          ...l,
          metaScore: calculateMetaScore(l.item, position),
        })).sort((a, b) => b.metaScore - a.metaScore);
        setCards(scored);
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, [position, budgetIdx]);

  const handleCompare = (uuid: string) => {
    setCompareIds(prev => {
      if (prev.includes(uuid)) return prev.filter(id => id !== uuid);
      if (prev.length >= 2) return [prev[1], uuid];
      return [...prev, uuid];
    });
  };

  const compareCards = compareIds.map(id => cards.find(c => c.item.uuid === id)).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Meta Tier List</h1>

      {/* Position Selector */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {ALL_POSITIONS.map(p => (
          <button key={p} onClick={() => { setPosition(p); setCompareIds([]); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${position === p ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {p}
          </button>
        ))}
      </div>

      {/* Budget Filter */}
      <div className="flex gap-1.5 mb-6">
        {BUDGET_TIERS.map((t, i) => (
          <button key={t.label} onClick={() => setBudgetIdx(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${budgetIdx === i ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Compare Panel */}
      {compareCards.length === 2 && (
        <div className="mb-6">
          <TierListCompare
            card1={compareCards[0]!.item} card2={compareCards[1]!.item}
            score1={compareCards[0]!.metaScore} score2={compareCards[1]!.metaScore}
            price1={compareCards[0]!.best_sell_price} price2={compareCards[1]!.best_sell_price}
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-bg-tertiary rounded-xl animate-pulse" />)}</div>
      ) : (
        <MetaTierList cards={cards} position={position} onCompare={handleCompare} compareSelected={compareIds} />
      )}
    </div>
  );
}
