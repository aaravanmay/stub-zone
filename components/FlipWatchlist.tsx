'use client';

import { WatchlistEntry, Listing } from '@/lib/types';
import { calculateFlip } from '@/lib/calculations';
import { Star, X } from 'lucide-react';

interface Props {
  watchlist: WatchlistEntry[];
  liveData: Record<string, Listing>;
  onRemove: (uuid: string) => void;
}

export default function FlipWatchlist({ watchlist, liveData, onRemove }: Props) {
  if (watchlist.length === 0) {
    return (
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-8 text-center">
        <Star size={32} className="text-text-tertiary mx-auto mb-3" />
        <div className="text-text-secondary">No cards watched yet.</div>
        <div className="text-text-tertiary text-sm mt-1">Star cards from the Flipping page to track them here.</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {watchlist.map(w => {
        const live = liveData[w.uuid];
        const flip = live ? calculateFlip(live.best_buy_price, live.best_sell_price) : null;
        return (
          <div key={w.uuid} className="bg-bg-secondary border border-border-subtle rounded-xl p-3 flex items-center gap-3">
            <img src={w.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-bg-tertiary" />
            <div className="flex-1 min-w-0">
              <a href={`/players/${w.uuid}`} className="text-text-primary text-sm font-medium hover:text-accent-primary transition-colors truncate block">{w.name}</a>
              <div className="text-text-tertiary text-xs">Added {new Date(w.addedAt).toLocaleDateString()}</div>
            </div>
            {live && (
              <div className="flex gap-4 text-right">
                <div><div className="text-text-tertiary text-xs">Buy</div><div className="font-mono text-sm">{live.best_buy_price.toLocaleString()}</div></div>
                <div><div className="text-text-tertiary text-xs">Sell</div><div className="font-mono text-sm">{live.best_sell_price.toLocaleString()}</div></div>
                <div><div className="text-text-tertiary text-xs">Profit</div><div className={`font-mono text-sm font-semibold ${flip!.profit >= 0 ? 'text-profit' : 'text-loss'}`}>{flip!.profit.toLocaleString()}</div></div>
              </div>
            )}
            <button onClick={() => onRemove(w.uuid)} className="text-text-tertiary hover:text-loss transition-colors p-1"><X size={16} /></button>
          </div>
        );
      })}
    </div>
  );
}
