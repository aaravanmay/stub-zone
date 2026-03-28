'use client';

import { Item } from '@/lib/types';
import RarityBadge from './RarityBadge';

interface Props {
  card1: Item;
  card2: Item;
  score1?: number;
  score2?: number;
  price1?: number;
  price2?: number;
}

function CompareRow({ label, v1, v2 }: { label: string; v1?: number; v2?: number }) {
  if (v1 === undefined || v2 === undefined) return null;
  const better1 = v1 > v2;
  const better2 = v2 > v1;
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className={`font-mono text-sm w-10 text-right ${better1 ? 'text-profit font-bold' : 'text-text-secondary'}`}>{v1}</span>
      <div className="flex-1 flex items-center gap-1">
        <div className="flex-1 bg-bg-tertiary rounded-full h-1.5 overflow-hidden flex justify-end">
          <div className={`h-full rounded-full ${better1 ? 'bg-profit' : 'bg-bg-surface'}`} style={{ width: `${(v1 / 125) * 100}%` }} />
        </div>
        <span className="text-text-tertiary text-xs w-16 text-center">{label}</span>
        <div className="flex-1 bg-bg-tertiary rounded-full h-1.5 overflow-hidden">
          <div className={`h-full rounded-full ${better2 ? 'bg-profit' : 'bg-bg-surface'}`} style={{ width: `${(v2 / 125) * 100}%` }} />
        </div>
      </div>
      <span className={`font-mono text-sm w-10 ${better2 ? 'text-profit font-bold' : 'text-text-secondary'}`}>{v2}</span>
    </div>
  );
}

export default function TierListCompare({ card1, card2, score1, score2, price1, price2 }: Props) {
  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
      <h3 className="font-heading font-semibold text-text-primary mb-4 text-center">Card Comparison</h3>
      <div className="flex items-start justify-between mb-6">
        <div className="text-center flex-1">
          <img src={card1.img} alt="" className="w-20 h-20 rounded-xl object-cover bg-bg-tertiary mx-auto mb-2" />
          <div className="text-text-primary font-medium text-sm">{card1.name}</div>
          <div className="font-mono font-bold text-xl text-text-primary">{card1.ovr}</div>
          <RarityBadge rarity={card1.rarity} />
          {score1 && <div className="text-accent-primary font-mono text-sm mt-1">Meta: {score1.toFixed(0)}</div>}
          {price1 && <div className="text-text-secondary font-mono text-xs">{price1.toLocaleString()} stubs</div>}
        </div>
        <div className="text-text-tertiary text-2xl font-bold mt-12">VS</div>
        <div className="text-center flex-1">
          <img src={card2.img} alt="" className="w-20 h-20 rounded-xl object-cover bg-bg-tertiary mx-auto mb-2" />
          <div className="text-text-primary font-medium text-sm">{card2.name}</div>
          <div className="font-mono font-bold text-xl text-text-primary">{card2.ovr}</div>
          <RarityBadge rarity={card2.rarity} />
          {score2 && <div className="text-accent-primary font-mono text-sm mt-1">Meta: {score2.toFixed(0)}</div>}
          {price2 && <div className="text-text-secondary font-mono text-xs">{price2.toLocaleString()} stubs</div>}
        </div>
      </div>
      <div>
        <CompareRow label="Con R" v1={card1.contact_right} v2={card2.contact_right} />
        <CompareRow label="Con L" v1={card1.contact_left} v2={card2.contact_left} />
        <CompareRow label="Pow R" v1={card1.power_right} v2={card2.power_right} />
        <CompareRow label="Pow L" v1={card1.power_left} v2={card2.power_left} />
        <CompareRow label="Speed" v1={card1.speed} v2={card2.speed} />
        <CompareRow label="Field" v1={card1.fielding} v2={card2.fielding} />
        <CompareRow label="Arm" v1={card1.arm_strength} v2={card2.arm_strength} />
      </div>
    </div>
  );
}
