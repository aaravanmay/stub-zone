'use client';

import { useState, useEffect, useCallback } from 'react';
import { Listing } from '@/lib/types';
import { RARITY_ORDER, POSITIONS, TEAMS } from '@/lib/constants';
import { calculateMetaScore } from '@/lib/calculations';
import PlayerCard from '@/components/PlayerCard';
import RarityBadge from '@/components/RarityBadge';
import { Search } from 'lucide-react';

export default function PlayersPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [team, setTeam] = useState('');
  const [rarity, setRarity] = useState('');
  const [sortCol, setSortCol] = useState('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), type: 'mlb_card' });
    if (search) params.set('name', search);
    if (position) params.set('display_position', position);
    if (team) params.set('team', team);
    if (rarity) params.set('rarity', rarity.toLowerCase());
    if (sortCol !== 'rank' && sortCol !== 'meta') {
      params.set('sort', sortCol === 'best_sell_price' ? 'best_sell_price' : 'rank');
    }
    params.set('order', sortDir);

    try {
      const res = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
      setTotalPages(data.total_pages || 1);
    } catch { setListings([]); }
    setLoading(false);
  }, [page, search, position, team, rarity, sortCol, sortDir]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Sort by meta if selected (client-side)
  const displayListings = sortCol === 'meta'
    ? [...listings].sort((a, b) => {
        const posA = a.item.display_position || 'C';
        const posB = b.item.display_position || 'C';
        const metaA = calculateMetaScore(a.item, posA);
        const metaB = calculateMetaScore(b.item, posB);
        return sortDir === 'desc' ? metaB - metaA : metaA - metaB;
      })
    : listings;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Player Database</h1>
        <div className="flex gap-1.5">
          <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${viewMode === 'grid' ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary'}`}>Grid</button>
          <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${viewMode === 'table' ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary'}`}>Table</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input type="text" placeholder="Search players..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-8 pr-3 py-2 bg-bg-surface border border-border-default rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none w-52" />
        </div>
        <select value={position} onChange={e => { setPosition(e.target.value); setPage(1); }} className="bg-bg-surface border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary outline-none">
          <option value="">All Positions</option>
          {[...POSITIONS, 'SP', 'RP', 'CP'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={team} onChange={e => { setTeam(e.target.value); setPage(1); }} className="bg-bg-surface border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary outline-none">
          <option value="">All Teams</option>
          {TEAMS.map(t => <option key={t.abbr} value={t.abbr}>{t.name}</option>)}
        </select>
        <div className="flex gap-1.5">
          {RARITY_ORDER.slice(1).map(r => (
            <button key={r} onClick={() => { setRarity(rarity === r ? '' : r); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${rarity === r ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
              {r}
            </button>
          ))}
        </div>
        {/* Sort by Meta */}
        <button
          onClick={() => {
            if (sortCol === 'meta') {
              setSortDir(d => d === 'desc' ? 'asc' : 'desc');
            } else {
              setSortCol('meta');
              setSortDir('desc');
            }
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${sortCol === 'meta' ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}
        >
          Sort by Meta {sortCol === 'meta' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden">
              <div className="aspect-square bg-bg-tertiary animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-bg-tertiary rounded animate-pulse" />
                <div className="h-3 bg-bg-tertiary rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayListings.map(l => (
            <PlayerCard key={l.item.uuid} item={l.item} showPrice buyPrice={l.best_buy_price} sellPrice={l.best_sell_price} />
          ))}
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border-subtle">
                {['Card', 'OVR', 'Meta', 'Pos', 'Team', 'Series', 'Rarity', 'Con R', 'Pow R', 'Speed', 'Field', 'Buy', 'Sell'].map(h => (
                  <th key={h} className="p-3 text-xs font-medium text-text-secondary uppercase tracking-wider text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayListings.map(l => {
                const meta = calculateMetaScore(l.item, l.item.display_position || 'C');
                return (
                  <tr key={l.item.uuid} className="border-b border-border-subtle/50 odd:bg-white/[0.02] hover:bg-[rgba(6,214,160,0.06)] transition-colors">
                    <td className="p-3">
                      <a href={`/players/${l.item.uuid}`} className="flex items-center gap-2 hover:text-accent-primary transition-colors">
                        <img src={l.item.img} alt="" className="w-8 h-8 rounded object-cover bg-bg-tertiary" loading="lazy" />
                        <span className="text-sm text-text-primary">{l.item.name}</span>
                      </a>
                    </td>
                    <td className="p-3 font-mono font-bold text-sm">{l.item.ovr}</td>
                    <td className="p-3 font-mono font-bold text-sm text-accent-primary">{meta.toFixed(0)}</td>
                    <td className="p-3 text-sm text-text-secondary">{l.item.display_position}</td>
                    <td className="p-3 text-sm text-text-secondary">{l.item.team}</td>
                    <td className="p-3 text-sm text-text-secondary">{l.item.series}</td>
                    <td className="p-3"><RarityBadge rarity={l.item.rarity} /></td>
                    <td className="p-3 font-mono text-sm">{l.item.contact_right}</td>
                    <td className="p-3 font-mono text-sm">{l.item.power_right}</td>
                    <td className="p-3 font-mono text-sm">{l.item.speed}</td>
                    <td className="p-3 font-mono text-sm">{l.item.fielding}</td>
                    <td className="p-3 font-mono text-sm text-right">{l.best_buy_price.toLocaleString()}</td>
                    <td className="p-3 font-mono text-sm text-right">{l.best_sell_price.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {displayListings.length === 0 && !loading && (
        <div className="text-center py-16 text-text-secondary">No players found matching your filters.</div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-4 py-2 rounded-lg border border-border-default text-text-secondary text-sm hover:border-accent-primary disabled:opacity-30 transition-colors">Previous</button>
        <span className="text-text-secondary text-sm font-mono">Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-4 py-2 rounded-lg border border-border-default text-text-secondary text-sm hover:border-accent-primary disabled:opacity-30 transition-colors">Next</button>
      </div>
    </div>
  );
}
