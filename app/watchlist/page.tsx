'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/lib/types';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useFlipLog } from '@/hooks/useFlipLog';
import FlipWatchlist from '@/components/FlipWatchlist';
import FlipLog from '@/components/FlipLog';
import ProfitTracker from '@/components/ProfitTracker';

export default function WatchlistPage() {
  const [tab, setTab] = useState<'watchlist' | 'log' | 'stats'>('watchlist');
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { flipLog, addFlip, removeFlip, getStats } = useFlipLog();
  const [liveData, setLiveData] = useState<Record<string, Listing>>({});

  useEffect(() => {
    const fetchLive = async () => {
      const results: Record<string, Listing> = {};
      await Promise.all(watchlist.map(async (w) => {
        try {
          const res = await fetch(`/api/listing/${w.uuid}`);
          const data = await res.json();
          results[w.uuid] = data;
        } catch {}
      }));
      setLiveData(results);
    };
    if (watchlist.length > 0) fetchLive();
    const interval = setInterval(fetchLive, 60000);
    return () => clearInterval(interval);
  }, [watchlist.length]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Flip Watchlist & Profit Tracker</h1>

      <div className="flex gap-1.5 mb-6">
        {(['watchlist', 'log', 'stats'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${tab === t ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {t === 'log' ? 'Flip Log' : t === 'stats' ? 'Stats' : 'Watchlist'}
          </button>
        ))}
      </div>

      {tab === 'watchlist' && <FlipWatchlist watchlist={watchlist} liveData={liveData} onRemove={removeFromWatchlist} />}
      {tab === 'log' && <FlipLog flipLog={flipLog} onAddFlip={addFlip} onRemoveFlip={removeFlip} />}
      {tab === 'stats' && <ProfitTracker flipLog={flipLog} stats={getStats()} />}
    </div>
  );
}
