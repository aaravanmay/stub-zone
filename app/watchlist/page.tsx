'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/lib/types';
import { useWatchlist } from '@/hooks/useWatchlist';
import FlipWatchlist from '@/components/FlipWatchlist';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();
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
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Flip Watchlist</h1>
      <FlipWatchlist watchlist={watchlist} liveData={liveData} onRemove={removeFromWatchlist} />
    </div>
  );
}
