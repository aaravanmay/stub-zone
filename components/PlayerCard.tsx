'use client';

import Link from 'next/link';
import { Item } from '@/lib/types';
import RarityBadge from './RarityBadge';

interface Props {
  item: Item;
  showPrice?: boolean;
  buyPrice?: number;
  sellPrice?: number;
}

export default function PlayerCard({ item, showPrice, buyPrice, sellPrice }: Props) {
  return (
    <Link
      href={`/players/${item.uuid}`}
      className="group bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden hover:border-[rgba(6,214,160,0.3)] hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-black/10"
    >
      <div className="aspect-square bg-bg-tertiary relative overflow-hidden">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-medium text-text-primary text-sm truncate group-hover:text-accent-primary transition-colors">{item.name}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <RarityBadge rarity={item.rarity} />
              <span className="text-text-tertiary text-xs">{item.display_position}</span>
            </div>
          </div>
          <div className="font-mono font-bold text-lg text-text-primary">{item.ovr}</div>
        </div>
        {showPrice && buyPrice !== undefined && (
          <div className="flex justify-between mt-2 pt-2 border-t border-border-subtle">
            <div className="text-xs">
              <span className="text-text-tertiary">Buy: </span>
              <span className="font-mono text-text-primary">{buyPrice.toLocaleString()}</span>
            </div>
            <div className="text-xs">
              <span className="text-text-tertiary">Sell: </span>
              <span className="font-mono text-text-primary">{sellPrice?.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
