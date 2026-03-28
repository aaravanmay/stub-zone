'use client';

import { useState, useEffect, useCallback } from 'react';
import { Listing } from '@/lib/types';
import { calculateFlip } from '@/lib/calculations';
import { RARITY_ORDER, POSITIONS, TEAMS } from '@/lib/constants';
import FlipTable from '@/components/FlipTable';
import FlipCalculator from '@/components/FlipCalculator';
import { useWatchlist } from '@/hooks/useWatchlist';
import { RefreshCw, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

export default function FlippingPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [rarity, setRarity] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [team, setTeam] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [minProfit, setMinProfit] = useState<number>(0);
  const [sortColumn, setSortColumn] = useState<string>('profit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { watchlist, addToWatchlist, removeFromWatchlist, isWatched } = useWatchlist();

  const watchedUuids = new Set(watchlist.map(w => w.uuid));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), type: 'mlb_card' });
      if (rarity) params.set('rarity', rarity.toLowerCase());
      if (position) params.set('display_position', position);
      if (team) params.set('team', team);
      if (search) params.set('name', search);
      params.set('sort', 'best_sell_price');
      params.set('order', 'desc');

      const res = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
      setTotalPages(data.total_pages || 1);
    } catch {
      setListings([]);
    }
    setLoading(false);
  }, [page, rarity, position, team, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const sortedListings = [...listings]
    .map((l) => ({ ...l, ...calculateFlip(l.best_buy_price, l.best_sell_price) }))
    .filter((l) => l.profit >= minProfit)
    .sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortColumn) {
        case 'name': return sortDirection === 'asc' ? a.listing_name.localeCompare(b.listing_name) : b.listing_name.localeCompare(a.listing_name);
        case 'best_buy_price': aVal = a.best_buy_price; bVal = b.best_buy_price; break;
        case 'best_sell_price': aVal = a.best_sell_price; bVal = b.best_sell_price; break;
        case 'margin': aVal = a.margin; bVal = b.margin; break;
        default: aVal = a.profit; bVal = b.profit;
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const handleSort = (col: string) => {
    if (sortColumn === col) setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortColumn(col); setSortDirection('desc'); }
  };

  const handleToggleWatch = (uuid: string, name: string, img: string) => {
    if (isWatched(uuid)) removeFromWatchlist(uuid);
    else addToWatchlist({ uuid, name, img, addedAt: new Date().toISOString() });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Market Flipping Tool</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="accent-accent-primary" />
            <RefreshCw size={14} className={autoRefresh ? 'animate-spin text-accent-primary' : ''} />
            Auto-refresh
          </label>
          <button onClick={() => setShowCalc(!showCalc)} className="flex items-center gap-1 text-sm text-text-secondary hover:text-accent-primary transition-colors">
            <Calculator size={14} />
            Calculator
            {showCalc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {showCalc && <div className="mb-6"><FlipCalculator /></div>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-bg-surface border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none w-48"
        />
        <div className="flex gap-1.5">
          {RARITY_ORDER.slice(1).map((r) => (
            <button
              key={r}
              onClick={() => { setRarity(rarity === r ? '' : r); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${rarity === r ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <select
          value={position}
          onChange={(e) => { setPosition(e.target.value); setPage(1); }}
          className="bg-bg-surface border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary outline-none"
        >
          <option value="">All Positions</option>
          {[...POSITIONS, 'SP', 'RP', 'CP'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={team}
          onChange={(e) => { setTeam(e.target.value); setPage(1); }}
          className="bg-bg-surface border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary outline-none"
        >
          <option value="">All Teams</option>
          {TEAMS.map(t => <option key={t.abbr} value={t.abbr}>{t.name}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <label className="text-text-secondary text-xs">Min Profit:</label>
          <input
            type="number"
            value={minProfit || ''}
            onChange={(e) => setMinProfit(Number(e.target.value))}
            placeholder="0"
            className="w-20 bg-bg-surface border border-border-default rounded-lg px-2 py-2 text-sm font-mono text-text-primary outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-bg-tertiary rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <FlipTable
            listings={sortedListings}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            watchedUuids={watchedUuids}
            onToggleWatch={handleToggleWatch}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="px-4 py-2 rounded-lg border border-border-default text-text-secondary text-sm hover:border-accent-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-text-secondary text-sm font-mono">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="px-4 py-2 rounded-lg border border-border-default text-text-secondary text-sm hover:border-accent-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
