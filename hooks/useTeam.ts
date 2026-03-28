'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Item } from '@/lib/types';

const STORAGE_KEY = 'stubzone-team';

const DEFAULT_POSITIONS = [
  'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF',
  'SP1', 'SP2', 'SP3', 'SP4', 'SP5',
  'BP1', 'BP2', 'BP3', 'BP4', 'BP5', 'BP6', 'BP7',
];

type TeamState = Record<string, Item | null>;

function createDefaultTeam(): TeamState {
  const team: TeamState = {};
  for (const pos of DEFAULT_POSITIONS) {
    team[pos] = null;
  }
  return team;
}

export function useTeam() {
  const [team, setTeam] = useState<TeamState>(() => {
    if (typeof window === 'undefined') return createDefaultTeam();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as TeamState;
    } catch {}
    return createDefaultTeam();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
    } catch {}
  }, [team]);

  const setPlayer = useCallback((position: string, item: Item) => {
    setTeam((prev) => ({ ...prev, [position]: item }));
  }, []);

  const removePlayer = useCallback((position: string) => {
    setTeam((prev) => ({ ...prev, [position]: null }));
  }, []);

  const resetTeam = useCallback(() => {
    setTeam(createDefaultTeam());
  }, []);

  const getTeamOVR = useCallback((): number => {
    const filled = Object.values(team).filter((p): p is Item => p !== null);
    if (filled.length === 0) return 0;
    const total = filled.reduce((sum, p) => sum + p.ovr, 0);
    return Math.round(total / filled.length);
  }, [team]);

  const getTeamValue = useCallback((): number => {
    return 0;
  }, []);

  return { team, setPlayer, removePlayer, resetTeam, getTeamOVR, getTeamValue };
}
