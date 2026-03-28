'use client';

import { useState, useEffect } from 'react';
import type { Item } from '@/lib/types';

export function usePlayerSearch(query: string) {
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/player-search?name=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Search failed');
        const data: Item[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
}
