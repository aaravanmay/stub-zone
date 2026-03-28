'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/lib/types';
import MarketMovers from '@/components/MarketMovers';

export default function MoversPage() {
  const [gainers, setGainers] = useState<any[]>([]);
  const [losers, setLosers] = useState<any[]>([]);
  const [indices, setIndices] = useState({ diamond: 0, gold: 0, silver: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch multiple pages to get a broad sample, sorted by different criteria to find movers
        const [highRes, lowRes] = await Promise.all([
          fetch('/api/listings?type=mlb_card&sort=best_sell_price&order=desc&page=1'),
          fetch('/api/listings?type=mlb_card&sort=best_sell_price&order=asc&page=1'),
        ]);
        const [highData, lowData] = await Promise.all([highRes.json(), lowRes.json()]);
        const allListings: Listing[] = [...(highData.listings || []), ...(lowData.listings || [])];

        // Deduplicate
        const seen = new Set<string>();
        const unique = allListings.filter(l => {
          if (seen.has(l.item.uuid)) return false;
          seen.add(l.item.uuid);
          return true;
        });

        // Calculate spread-based movers (cards with high buy/sell spread indicate recent movement)
        const movers = unique
          .filter(l => l.best_sell_price > 100 && l.best_buy_price > 0)
          .map(l => {
            const spread = l.best_sell_price - l.best_buy_price;
            const spreadPct = (spread / l.best_buy_price) * 100;
            return {
              name: l.item.name,
              img: l.item.img,
              rarity: l.item.rarity,
              price: l.best_sell_price,
              buyPrice: l.best_buy_price,
              change: spread,
              pctChange: spreadPct,
            };
          });

        // Top gainers = highest priced cards (likely trending up)
        const sorted = movers.sort((a, b) => b.pctChange - a.pctChange);
        setGainers(sorted.filter(m => m.pctChange > 5).slice(0, 10));

        // Losers = cards with the tightest spreads relative to price (being dumped)
        const losersSorted = movers
          .filter(m => m.pctChange <= 5 && m.price > 500)
          .sort((a, b) => a.pctChange - b.pctChange);
        setLosers(losersSorted.slice(0, 10).map(m => ({
          ...m,
          change: -Math.abs(m.change),
          pctChange: -Math.abs(m.pctChange),
        })));
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

    fetchData();
    const interval = setInterval(fetchData, 120000);
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
              No significant market movement detected right now.
            </div>
          )}
        </>
      )}
    </div>
  );
}
