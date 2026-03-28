'use client';

import { Listing } from '@/lib/types';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

interface Props {
  teamName: string;
  listings: Listing[];
  ownedCards: string[];
  onToggleOwned: (uuid: string) => void;
}

export default function CollectionCard({ teamName, listings, ownedCards, onToggleOwned }: Props) {
  const [expanded, setExpanded] = useState(false);
  const owned = listings.filter(l => ownedCards.includes(l.item.uuid)).length;
  const total = listings.length;
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0;
  const remainingCost = listings.filter(l => !ownedCards.includes(l.item.uuid)).reduce((s, l) => s + l.best_buy_price, 0);

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4 hover:bg-bg-tertiary transition-colors">
        <div className="flex items-center gap-3">
          <span className="font-heading font-semibold text-text-primary">{teamName}</span>
          <span className="text-text-tertiary text-xs">{owned}/{total}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 bg-bg-tertiary rounded-full h-2 overflow-hidden">
            <div className="h-full bg-accent-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-mono text-sm text-text-secondary">{remainingCost.toLocaleString()} stubs</span>
          {expanded ? <ChevronUp size={16} className="text-text-tertiary" /> : <ChevronDown size={16} className="text-text-tertiary" />}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border-subtle p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {listings.map(l => {
            const isOwned = ownedCards.includes(l.item.uuid);
            return (
              <button key={l.item.uuid} onClick={() => onToggleOwned(l.item.uuid)}
                className={`relative p-2 rounded-lg border transition-all text-left ${isOwned ? 'border-profit/30 bg-profit/5 opacity-60' : 'border-border-subtle hover:border-border-hover'}`}>
                {isOwned && <div className="absolute top-1 right-1 w-5 h-5 bg-profit rounded-full flex items-center justify-center"><Check size={12} className="text-bg-primary" /></div>}
                <img src={l.item.img} alt="" className="w-full aspect-square rounded object-cover bg-bg-tertiary mb-1" loading="lazy" />
                <div className="text-text-primary text-xs truncate">{l.item.name}</div>
                <div className="font-mono text-xs text-text-secondary">{l.best_buy_price.toLocaleString()}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
