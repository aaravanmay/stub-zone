'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/lib/types';
import ExchangeCalc from '@/components/ExchangeCalc';

const TIERS = [
  { label: 'Bronze → Silver', inputRarity: 'bronze', targetPoints: 1000 },
  { label: 'Silver → Gold', inputRarity: 'silver', targetPoints: 3000 },
  { label: 'Gold → Diamond', inputRarity: 'gold', targetPoints: 10000 },
];

export default function ExchangesPage() {
  const [tierIdx, setTierIdx] = useState(0);
  const [cards, setCards] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const tier = TIERS[tierIdx];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ type: 'mlb_card', rarity: tier.inputRarity, sort: 'best_buy_price', order: 'asc', page: '1' });
    fetch(`/api/listings?${params}`)
      .then(r => r.json())
      .then(data => setCards(data.listings || []))
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, [tier.inputRarity]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Exchange Calculator</h1>
      <div className="flex gap-1.5 mb-6">
        {TIERS.map((t, i) => (
          <button key={t.label} onClick={() => setTierIdx(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${tierIdx === i ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-bg-tertiary rounded-lg animate-pulse" />)}</div>
      ) : (
        <ExchangeCalc cards={cards} targetPoints={tier.targetPoints} tierName={tier.label} />
      )}
    </div>
  );
}
