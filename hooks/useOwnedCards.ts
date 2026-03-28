'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'stubzone-owned';

export function useOwnedCards() {
  const [ownedCards, setOwnedCards] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as string[];
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ownedCards));
    } catch {}
  }, [ownedCards]);

  const toggleOwned = useCallback((uuid: string) => {
    setOwnedCards((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid],
    );
  }, []);

  const isOwned = useCallback(
    (uuid: string): boolean => {
      return ownedCards.includes(uuid);
    },
    [ownedCards],
  );

  const clearOwned = useCallback(() => {
    setOwnedCards([]);
  }, []);

  const ownedCount = ownedCards.length;

  return { ownedCards, toggleOwned, isOwned, clearOwned, ownedCount };
}
