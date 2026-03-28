'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'stubzone-conquest';

type ConquestState = Record<string, string[]>;

export function useConquestProgress() {
  const [progress, setProgress] = useState<ConquestState>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as ConquestState;
    } catch {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const toggleReward = useCallback((mapId: string, rewardId: string) => {
    setProgress((prev) => {
      const collected = prev[mapId] ?? [];
      const updated = collected.includes(rewardId)
        ? collected.filter((id) => id !== rewardId)
        : [...collected, rewardId];
      return { ...prev, [mapId]: updated };
    });
  }, []);

  const isCollected = useCallback(
    (mapId: string, rewardId: string): boolean => {
      return (progress[mapId] ?? []).includes(rewardId);
    },
    [progress],
  );

  const getMapCompletion = useCallback(
    (mapId: string, totalRewards: number): number => {
      if (totalRewards === 0) return 0;
      const collected = (progress[mapId] ?? []).length;
      return Math.round((collected / totalRewards) * 100);
    },
    [progress],
  );

  const clearMap = useCallback((mapId: string) => {
    setProgress((prev) => {
      const next = { ...prev };
      delete next[mapId];
      return next;
    });
  }, []);

  return { progress, toggleReward, isCollected, getMapCompletion, clearMap };
}
