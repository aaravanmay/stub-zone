'use client';

import { Listing } from '@/lib/types';
import { calculateFlip } from '@/lib/calculations';
import RarityBadge from './RarityBadge';
import Sparkline from './Sparkline';
import { Star } from 'lucide-react';

interface FlipTableProps {
  listings: Listing[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
  watchedUuids?: Set<string>;
  onToggleWatch?: (uuid: string, name: string, img: string) => void;
}

export default function FlipTable({ listings, sortColumn, sortDirection, onSort, watchedUuids, onToggleWatch }: FlipTableProps) {
  const headers = [
    { key: 'name', label: 'Card', align: 'left' as const },
    { key: 'best_buy_price', label: 'Buy Price', align: 'right' as const },
    { key: 'best_sell_price', label: 'Sell Price', align: 'right' as const },
    { key: 'profit', label: 'Profit', align: 'right' as const },
    { key: 'margin', label: 'Margin %', align: 'right' as const },
    { key: 'trend', label: 'Trend', align: 'center' as const },
  ];

  const SortIcon = ({ col }: { col: string }) => {
    if (sortColumn !== col) return <span className="text-text-tertiary ml-1">↕</span>;
    return <span className="text-accent-primary ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="overflow-x-auto scrollbar-dark">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="sticky top-0 z-10 backdrop-blur-sm bg-bg-primary/80">
            <th className="w-8 p-3"></th>
            {headers.map((h) => (
              <th
                key={h.key}
                onClick={() => onSort(h.key)}
                className={`p-3 text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-accent-primary transition-colors ${h.align === 'right' ? 'text-right' : h.align === 'center' ? 'text-center' : 'text-left'}`}
              >
                {h.label}<SortIcon col={h.key} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => {
            const { profit, margin } = calculateFlip(listing.best_buy_price, listing.best_sell_price);
            const isWatched = watchedUuids?.has(listing.item.uuid);
            return (
              <tr
                key={listing.item.uuid}
                className="border-b border-border-subtle/50 odd:bg-white/[0.02] hover:bg-[rgba(6,214,160,0.06)] transition-colors"
              >
                <td className="p-3">
                  <button
                    onClick={() => onToggleWatch?.(listing.item.uuid, listing.item.name, listing.item.img)}
                    className={`transition-colors ${isWatched ? 'text-warning' : 'text-text-tertiary hover:text-warning'}`}
                  >
                    <Star size={16} fill={isWatched ? 'currentColor' : 'none'} />
                  </button>
                </td>
                <td className="p-3">
                  <a href={`/players/${listing.item.uuid}`} className="flex items-center gap-3 group">
                    <img
                      src={listing.item.img}
                      alt={listing.item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-bg-tertiary"
                      loading="lazy"
                    />
                    <div>
                      <div className="text-text-primary font-medium group-hover:text-accent-primary transition-colors text-sm">
                        {listing.listing_name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <RarityBadge rarity={listing.item.rarity} />
                        <span className="text-text-tertiary text-xs">{listing.item.display_position}</span>
                      </div>
                    </div>
                  </a>
                </td>
                <td className="p-3 text-right font-mono text-sm text-text-primary">
                  {listing.best_buy_price.toLocaleString()}
                </td>
                <td className="p-3 text-right font-mono text-sm text-text-primary">
                  {listing.best_sell_price.toLocaleString()}
                </td>
                <td className={`p-3 text-right font-mono text-sm font-semibold ${profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {profit.toLocaleString()}
                </td>
                <td className={`p-3 text-right font-mono text-sm ${profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {margin.toFixed(1)}%
                </td>
                <td className="p-3 flex justify-center">
                  <Sparkline data={[listing.best_buy_price * 0.95, listing.best_buy_price, listing.best_sell_price * 0.98, listing.best_sell_price]} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {listings.length === 0 && (
        <div className="text-center py-12 text-text-secondary">No listings found matching your filters.</div>
      )}
    </div>
  );
}
