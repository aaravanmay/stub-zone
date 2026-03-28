'use client';

import { useState, useRef, useEffect } from 'react';
import { Item } from '@/lib/types';
import { usePlayerSearch } from '@/hooks/usePlayerSearch';
import { RARITY_COLORS } from '@/lib/constants';
import { Search, X } from 'lucide-react';

interface Props {
  position: string;
  onSelect: (item: Item) => void;
  currentPlayer: Item | null;
  onClear: () => void;
}

export default function PlayerSearchAutocomplete({ position, onSelect, currentPlayer, onClear }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { results, loading } = usePlayerSearch(query);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setSelectedIndex(0); }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setIsOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[selectedIndex]) {
      onSelect(results[selectedIndex]);
      setQuery('');
      setIsOpen(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const r = RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS['Common'];
    return r.dot;
  };

  if (currentPlayer) {
    return (
      <div className="flex items-center gap-3 bg-bg-secondary border border-border-subtle rounded-xl p-3 group">
        <img src={currentPlayer.img} alt={currentPlayer.name} className="w-12 h-12 rounded-lg object-cover bg-bg-tertiary" />
        <div className="flex-1 min-w-0">
          <div className="text-text-primary font-medium text-sm truncate">{currentPlayer.name}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-2 h-2 rounded-full" style={{ background: getRarityColor(currentPlayer.rarity) }} />
            <span className="text-text-secondary text-xs">{currentPlayer.display_position}</span>
            <span className="text-text-tertiary text-xs">{currentPlayer.series}</span>
          </div>
        </div>
        <span className="font-mono font-bold text-xl text-text-primary">{currentPlayer.ovr}</span>
        <button onClick={onClear} className="text-text-tertiary hover:text-loss transition-colors p-1">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => { if (results.length) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={`Search ${position}...`}
          className="w-full pl-8 pr-3 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none transition-all"
        />
      </div>
      {isOpen && (query.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border-default rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50">
          {loading && <div className="p-3 text-text-secondary text-sm">Searching...</div>}
          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="p-3 text-text-secondary text-sm">No players found</div>
          )}
          {results.map((item, idx) => (
            <button
              key={item.uuid + idx}
              onClick={() => { onSelect(item); setQuery(''); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 p-2.5 text-left transition-colors ${idx === selectedIndex ? 'bg-[rgba(6,214,160,0.08)]' : 'hover:bg-[rgba(6,214,160,0.06)]'}`}
            >
              <img src={item.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-bg-tertiary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-text-primary text-sm font-medium truncate">{item.name}</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-text-tertiary text-xs">{item.series}</span>
                  <span className="text-text-tertiary text-xs">{item.display_position}</span>
                </div>
              </div>
              <span className="font-mono font-bold text-lg text-text-primary">{item.ovr}</span>
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: getRarityColor(item.rarity) }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
