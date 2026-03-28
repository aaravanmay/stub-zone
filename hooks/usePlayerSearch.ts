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
        const data = await res.json();

        // Handle both array and object response formats
        let items: any[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data && Array.isArray(data.results)) {
          items = data.results;
        } else if (data && Array.isArray(data.items)) {
          items = data.items;
        }

        // Normalize items to ensure required fields exist
        const normalized: Item[] = items.map((item: any) => ({
          uuid: item.uuid || '',
          img: item.img || '',
          name: item.name || '',
          rarity: item.rarity || 'Common',
          team: item.team || '',
          ovr: item.ovr || 0,
          series: item.series || '',
          display_position: item.display_position || '',
          has_augment: item.has_augment || false,
          augment_text: item.augment_text || '',
          augment_end_date: item.augment_end_date || '',
          quirks: item.quirks || [],
          contact_left: item.contact_left || 0,
          contact_right: item.contact_right || 0,
          power_left: item.power_left || 0,
          power_right: item.power_right || 0,
          speed: item.speed || 0,
          fielding: item.fielding || 0,
          arm_strength: item.arm_strength || 0,
          stamina_or_dummy: item.stamina_or_dummy || 0,
          stamina: item.stamina,
          hits_per_bf: item.hits_per_bf,
          k_per_bf: item.k_per_bf,
          bb_per_bf: item.bb_per_bf,
          hr_per_bf: item.hr_per_bf,
          pitch_velocity: item.pitch_velocity,
          pitch_control: item.pitch_control,
          pitch_movement: item.pitch_movement,
        })).filter((item: Item) => item.uuid && item.name);

        setResults(normalized);
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
