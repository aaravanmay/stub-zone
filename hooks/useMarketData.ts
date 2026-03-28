'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Listing } from '@/lib/types';

interface UseMarketDataParams {
  [key: string]: string | number | boolean | undefined;
}

export function useMarketData(params: UseMarketDataParams, refreshInterval = 0) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(paramsRef.current)) {
        if (value !== undefined && value !== '') {
          searchParams.set(key, String(value));
        }
      }
      const res = await fetch(`/api/listings?${searchParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch listings');
      const data = await res.json();
      setListings(data.listings ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings, params]);

  useEffect(() => {
    if (refreshInterval <= 0) return;
    const id = setInterval(fetchListings, refreshInterval);
    return () => clearInterval(id);
  }, [refreshInterval, fetchListings]);

  return { listings, loading, error, refresh: fetchListings };
}
