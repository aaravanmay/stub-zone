'use client';

import { Listing } from '@/lib/types';
import RarityBadge from './RarityBadge';
import { RARITY_COLORS } from '@/lib/constants';

interface ScoredListing extends Listing {
  metaScore: number;
}

interface Props {
  cards: ScoredListing[];
  position: string;
  onCompare?: (uuid: string) => void;
  compareSelected?: string[];
}

const TIERS = [
  { name: 'S', color: 'text-rarity-gold', bg: 'bg-rarity-gold/10', range: [0, 3] },
  { name: 'A', color: 'text-profit', bg: 'bg-profit/10', range: [3, 10] },
  { name: 'B', color: 'text-info', bg: 'bg-info/10', range: [10, 20] },
  { name: 'C', color: 'text-text-secondary', bg: 'bg-bg-tertiary', range: [20, Infinity] },
];

export default function MetaTierList({ cards, position, onCompare, compareSelected }: Props) {
  if (cards.length === 0) {
    return <div className="text-center text-text-secondary py-8">No cards found for {position}</div>;
  }

  return (
    <div className="space-y-6">
      {TIERS.map(tier => {
        const tierCards = cards.slice(tier.range[0], tier.range[1]);
        if (tierCards.length === 0) return null;
        return (
          <div key={tier.name}>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${tier.bg} mb-3`}>
              <span className={`font-heading font-bold text-lg ${tier.color}`}>{tier.name}</span>
              <span className="text-text-tertiary text-xs">Tier</span>
            </div>
            <div className="space-y-2">
              {tierCards.map((card, idx) => {
                const rank = tier.range[0] + idx + 1;
                const isSelected = compareSelected?.includes(card.item.uuid);
                return (
                  <div key={card.item.uuid}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isSelected ? 'border-accent-primary bg-accent-muted' : 'border-border-subtle bg-bg-secondary hover:bg-bg-tertiary'}`}>
                    <span className="font-mono text-text-tertiary text-sm w-6 text-right">#{rank}</span>
                    <img src={card.item.img} alt="" className="w-12 h-12 rounded-lg object-cover bg-bg-tertiary" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <a href={`/players/${card.item.uuid}`} className="text-text-primary font-medium text-sm hover:text-accent-primary transition-colors truncate block">{card.item.name}</a>
                      <div className="flex items-center gap-2 mt-0.5">
                        <RarityBadge rarity={card.item.rarity} />
                        {card.item.quirks?.slice(0, 3).map(q => (
                          <span key={q} className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary rounded text-text-tertiary">{q}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-text-primary">{card.item.ovr}</div>
                      <div className="text-text-tertiary text-xs">OVR</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-accent-primary">{card.metaScore.toFixed(0)}</div>
                      <div className="text-text-tertiary text-xs">Meta</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-text-secondary">{card.best_sell_price.toLocaleString()}</div>
                      <div className="text-text-tertiary text-xs">stubs</div>
                    </div>
                    {onCompare && (
                      <button onClick={() => onCompare(card.item.uuid)}
                        className={`px-2 py-1 rounded text-xs border transition-all ${isSelected ? 'border-accent-primary text-accent-primary' : 'border-border-default text-text-tertiary hover:border-border-hover'}`}>
                        Compare
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
