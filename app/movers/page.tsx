'use client';

import { useState, useEffect, useRef } from 'react';
import { Listing } from '@/lib/types';
import MarketMovers from '@/components/MarketMovers';

export default function MoversPage() {
  const [gainers, setGainers] = useState<any[]>([]);
  const [losers, setLosers] = useState<any[]>([]);
  const [indices, setIndices] = useState({ diamond: 0, gold: 0, silver: 0 });
  const [loading, setLoading] = useState(true);
  const prevPrices = useRef<Record<string, number>>({});

  const fetchAndCompare = async () => {
    try {
      const res = await fetch('/api/listings?type=mlb_card&sort=best_sell_price&order=desc&page=1');
      const data = await res.json();
      const listings: Listing[] = data.listings || [];

      const changes: { name: string; img: string; rarity: string; price: number; change: number; pctChange: number }[] = [];

      for (const l of listings) {
        const prev = prevPrices.current[l.item.uuid];
        const cur = l.best_sell_price;
        if (prev && prev !== cur) {
          changes.push({
            name: l.item.name, img: l.item.img, rarity: l.item.rarity,
            price: cur, change: cur - prev, pctChange: ((cur - prev) / prev) * 100,
          });
        }
        prevPrices.current[l.item.uuid] = cur;
      }

      const sorted = changes.sort((a, b) => b.pctChange - a.pctChange);
      setGainers(sorted.filter(c => c.change > 0).slice(0, 10));
      setLosers(sorted.filter(c => c.change < 0).sort((a, b) => a.pctChange - b.pctChange).slice(0, 10));
    } catch {}

    // Fetch indices
    try {
      const [dRes, gRes, sRes] = await Promise.all([
        fetch('/api/listings?type=mlb_card&rarity=diamond&page=1'),
        fetch('/api/listings?type=mlb_card&rarity=gold&page=1'),
        fetch('/api/listings?type=mlb_card&rarity=silver&page=1'),
      ]);
      const [dData, gData, sData] = await Promise.all([dRes.json(), gRes.json(), sRes.json()]);
      const avg = (listings: Listing[]) => listings.length ? Math.round(listings.reduce((s, l) => s + l.best_sell_price, 0) / listings.length) : 0;
      setIndices({ diamond: avg(dData.listings || []), gold: avg(gData.listings || []), silver: avg(sData.listings || []) });
    } catch {}

    setLoading(false);
  };

  useEffect(() => {
    fetchAndCompare();
    const interval = setInterval(fetchAndCompare, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Market Movers</h1>

      {/* Indices */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Avg Diamond', value: indices.diamond, color: 'text-rarity-diamond' },
          { label: 'Avg Gold', value: indices.gold, color: 'text-rarity-gold' },
          { label: 'Avg Silver', value: indices.silver, color: 'text-rarity-silver' },
        ].map(idx => (
          <div key={idx.label} className="bg-bg-secondary border border-border-subtle rounded-xl p-4 text-center">
            <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">{idx.label}</div>
            <div className={`font-mono font-bold text-2xl ${idx.color}`}>{idx.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[0, 1].map(i => <div key={i} className="h-64 bg-bg-tertiary rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <>
          <MarketMovers gainers={gainers} losers={losers} />
          {gainers.length === 0 && losers.length === 0 && (
            <div className="text-center text-text-secondary mt-4 text-sm">
              Tracking changes since page load. Prices update every 60 seconds.
            </div>
          )}
        </>
      )}
    </div>
  );
}
