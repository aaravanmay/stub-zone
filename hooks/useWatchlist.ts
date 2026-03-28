'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WatchlistEntry } from '@/lib/types';

const STORAGE_KEY = 'stubzone-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as WatchlistEntry[];
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch {}
  }, [watchlist]);

  const addToWatchlist = useCallback((entry: WatchlistEntry) => {
    setWatchlist((prev) => {
      if (prev.some((e) => e.uuid === entry.uuid)) return prev;
      return [...prev, entry];
    });
  }, []);

  const removeFromWatchlist = useCallback((uuid: string) => {
    setWatchlist((prev) => prev.filter((e) => e.uuid !== uuid));
  }, []);

  const isWatched = useCallback(
    (uuid: string): boolean => {
      return watchlist.some((e) => e.uuid === uuid);
    },
    [watchlist],
  );

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  return { watchlist, addToWatchlist, removeFromWatchlist, isWatched, clearWatchlist };
}
