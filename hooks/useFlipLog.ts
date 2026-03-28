'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FlipLogEntry } from '@/lib/types';

const STORAGE_KEY = 'stubzone-fliplog';

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

type NewFlipEntry = Omit<FlipLogEntry, 'id' | 'profit'>;

interface FlipStats {
  totalProfit: number;
  todayProfit: number;
  weekProfit: number;
  totalFlips: number;
  avgProfit: number;
  bestFlip: FlipLogEntry | null;
}

export function useFlipLog() {
  const [flipLog, setFlipLog] = useState<FlipLogEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as FlipLogEntry[];
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flipLog));
    } catch {}
  }, [flipLog]);

  const addFlip = useCallback((entry: NewFlipEntry) => {
    const profit = Math.round(entry.sellPrice * 0.9 - entry.buyPrice);
    const newEntry: FlipLogEntry = {
      ...entry,
      id: generateId(),
      profit,
    };
    setFlipLog((prev) => [...prev, newEntry]);
  }, []);

  const removeFlip = useCallback((id: string) => {
    setFlipLog((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getStats = useCallback((): FlipStats => {
    if (flipLog.length === 0) {
      return { totalProfit: 0, todayProfit: 0, weekProfit: 0, totalFlips: 0, avgProfit: 0, bestFlip: null };
    }

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let totalProfit = 0;
    let todayProfit = 0;
    let weekProfit = 0;
    let bestFlip: FlipLogEntry | null = null;

    for (const entry of flipLog) {
      totalProfit += entry.profit;

      if (entry.date.startsWith(todayStr)) {
        todayProfit += entry.profit;
      }

      if (new Date(entry.date) >= weekAgo) {
        weekProfit += entry.profit;
      }

      if (!bestFlip || entry.profit > bestFlip.profit) {
        bestFlip = entry;
      }
    }

    return {
      totalProfit,
      todayProfit,
      weekProfit,
      totalFlips: flipLog.length,
      avgProfit: Math.round(totalProfit / flipLog.length),
      bestFlip,
    };
  }, [flipLog]);

  return { flipLog, addFlip, removeFlip, getStats };
}
