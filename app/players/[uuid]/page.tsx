'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SingleListing } from '@/lib/types';
import { calculateFlip } from '@/lib/calculations';
import RarityBadge from '@/components/RarityBadge';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function StatBar({ label, value, max = 125 }: { label: string; value?: number; max?: number }) {
  if (value === undefined || value === null) return null;
  const pct = Math.min((value / max) * 100, 100);
  const color = value >= 90 ? 'bg-profit' : value >= 70 ? 'bg-accent-secondary' : value >= 50 ? 'bg-warning' : 'bg-loss';
  return (
    <div className="flex items-center gap-3">
      <span className="text-text-secondary text-xs w-20 text-right">{label}</span>
      <div className="flex-1 bg-bg-tertiary rounded-full h-2.5 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-sm font-semibold text-text-primary w-8">{value}</span>
    </div>
  );
}

export default function CardDetailPage() {
  const params = useParams();
  const uuid = params.uuid as string;
  const [listing, setListing] = useState<SingleListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uuid) return;
    setLoading(true);
    fetch(`/api/listing/${uuid}`)
      .then(r => r.json())
      .then(data => setListing(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [uuid]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="h-8 w-32 bg-bg-tertiary rounded animate-pulse" />
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          <div className="aspect-square bg-bg-tertiary rounded-xl animate-pulse" />
          <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-6 bg-bg-tertiary rounded animate-pulse" />)}</div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-text-secondary">Card not found.</div>;
  }

  const item = listing.item;
  const { profit, margin, tax } = calculateFlip(listing.best_buy_price, listing.best_sell_price);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link href="/players" className="inline-flex items-center gap-1 text-text-secondary hover:text-accent-primary transition-colors text-sm mb-6">
        <ArrowLeft size={14} /> Back to Players
      </Link>

      {/* Header */}
      <div className="grid md:grid-cols-[280px_1fr] gap-6 mb-8">
        <div className="bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden">
          <img src={item.img} alt={item.name} className="w-full aspect-square object-cover" />
        </div>
        <div>
          <div className="flex items-start gap-3 mb-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-text-primary">{item.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <RarityBadge rarity={item.rarity} />
                <span className="text-text-secondary text-sm">{item.display_position}</span>
                <span className="text-text-tertiary text-sm">{item.team}</span>
                <span className="text-text-tertiary text-sm">{item.series}</span>
              </div>
            </div>
            <div className="ml-auto font-mono text-4xl font-bold text-text-primary">{item.ovr}</div>
          </div>

          {/* Market */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Buy Now', value: listing.best_sell_price, color: 'text-text-primary' },
              { label: 'Sell Now', value: listing.best_buy_price, color: 'text-text-primary' },
              { label: 'Profit', value: profit, color: profit >= 0 ? 'text-profit' : 'text-loss' },
              { label: 'Margin', value: null, display: `${margin.toFixed(1)}%`, color: profit >= 0 ? 'text-profit' : 'text-loss' },
            ].map(s => (
              <div key={s.label} className="bg-bg-secondary border border-border-subtle rounded-xl p-3">
                <div className="text-text-tertiary text-xs mb-0.5">{s.label}</div>
                <div className={`font-mono font-bold text-lg ${s.color}`}>
                  {s.display || s.value?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Quirks */}
          {item.quirks?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-text-secondary text-xs uppercase tracking-wider mb-2">Quirks</h3>
              <div className="flex flex-wrap gap-1.5">
                {item.quirks.map(q => (
                  <span key={q} className="px-2 py-0.5 bg-bg-tertiary border border-border-subtle rounded-full text-xs text-text-secondary">{q}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
          <h3 className="font-heading font-semibold text-text-primary mb-4">Hitting</h3>
          <div className="space-y-2.5">
            <StatBar label="Con vs R" value={item.contact_right} />
            <StatBar label="Con vs L" value={item.contact_left} />
            <StatBar label="Pow vs R" value={item.power_right} />
            <StatBar label="Pow vs L" value={item.power_left} />
            <StatBar label="Speed" value={item.speed} />
          </div>
        </div>
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
          <h3 className="font-heading font-semibold text-text-primary mb-4">Fielding & Other</h3>
          <div className="space-y-2.5">
            <StatBar label="Fielding" value={item.fielding} />
            <StatBar label="Arm Str" value={item.arm_strength} />
            {item.stamina && <StatBar label="Stamina" value={item.stamina} />}
            {item.hits_per_bf && <StatBar label="H/9" value={item.hits_per_bf} />}
            {item.k_per_bf && <StatBar label="K/9" value={item.k_per_bf} />}
            {item.bb_per_bf && <StatBar label="BB/9" value={item.bb_per_bf} />}
            {item.pitch_velocity && <StatBar label="Velocity" value={item.pitch_velocity} />}
            {item.pitch_control && <StatBar label="Control" value={item.pitch_control} />}
          </div>
        </div>
      </div>

      {/* Price History */}
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 mb-8">
        <h3 className="font-heading font-semibold text-text-primary mb-4">Price History</h3>
        <PriceHistoryChart priceHistory={listing.price_history || []} />
      </div>

      {/* Recent Sales */}
      {listing.completed_orders?.length > 0 && (
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
          <h3 className="font-heading font-semibold text-text-primary mb-4">Recent Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left p-2 text-xs text-text-secondary uppercase">Date</th>
                  <th className="text-right p-2 text-xs text-text-secondary uppercase">Price</th>
                </tr>
              </thead>
              <tbody>
                {listing.completed_orders.slice(0, 15).map((o, i) => (
                  <tr key={i} className="border-b border-border-subtle/50 odd:bg-white/[0.02]">
                    <td className="p-2 text-sm text-text-secondary">{new Date(o.date).toLocaleString()}</td>
                    <td className="p-2 text-right font-mono text-sm text-text-primary">{Number(o.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
