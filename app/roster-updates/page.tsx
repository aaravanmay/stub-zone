'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/lib/types';
import RarityBadge from '@/components/RarityBadge';
import { TrendingUp, Calendar } from 'lucide-react';

export default function RosterUpdatesPage() {
  const [rosterUpdates, setRosterUpdates] = useState<any[]>([]);
  const [investments, setInvestments] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'updates' | 'investments'>('investments');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ruRes, invRes] = await Promise.all([
          fetch('/api/roster-updates'),
          fetch('/api/listings?type=mlb_card&rarity=gold&series_id=1337&sort=rank&order=desc&page=1'),
        ]);
        const [ruData, invData] = await Promise.all([ruRes.json(), invRes.json()]);
        setRosterUpdates(Array.isArray(ruData) ? ruData : ruData.roster_updates || []);
        setInvestments((invData.listings || []).sort((a: Listing, b: Listing) => b.item.ovr - a.item.ovr));
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const getInvestmentScore = (ovr: number): { score: number; label: string; color: string } => {
    if (ovr >= 84) return { score: 95, label: 'Very Likely', color: 'text-profit' };
    if (ovr >= 83) return { score: 75, label: 'Likely', color: 'text-accent-primary' };
    if (ovr >= 82) return { score: 50, label: 'Possible', color: 'text-warning' };
    return { score: 25, label: 'Unlikely', color: 'text-text-tertiary' };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Roster Update Predictor</h1>

      <div className="flex gap-1.5 mb-6">
        {(['investments', 'updates'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${tab === t ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {t === 'investments' ? 'Investment Opportunities' : 'Recent Updates'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-bg-tertiary rounded-xl animate-pulse" />)}</div>
      ) : tab === 'investments' ? (
        <div>
          <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 mb-6">
            <h3 className="font-heading font-semibold text-text-primary mb-1">How Investment Works</h3>
            <p className="text-text-secondary text-sm">
              Gold cards at 83-84 OVR are closest to Diamond threshold (85+). If they get upgraded in a roster update,
              their price typically jumps 5-20x. Buy before the update, sell after. Roster updates typically happen every 2 weeks.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {investments.map(l => {
              const inv = getInvestmentScore(l.item.ovr);
              const potentialValue = l.item.ovr >= 83 ? l.best_sell_price * 5 : l.best_sell_price * 2;
              return (
                <a key={l.item.uuid} href={`/players/${l.item.uuid}`}
                  className="bg-bg-secondary border border-border-subtle rounded-xl p-4 hover:border-[rgba(6,214,160,0.3)] transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={l.item.img} alt="" className="w-12 h-12 rounded-lg object-cover bg-bg-tertiary" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <div className="text-text-primary font-medium text-sm truncate group-hover:text-accent-primary transition-colors">{l.item.name}</div>
                      <div className="flex items-center gap-2">
                        <RarityBadge rarity={l.item.rarity} />
                        <span className="text-text-tertiary text-xs">{l.item.display_position} - {l.item.team}</span>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-lg text-text-primary">{l.item.ovr}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-text-tertiary text-xs">Current: </span>
                      <span className="font-mono text-text-secondary">{l.best_sell_price.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-text-tertiary text-xs">If Diamond: </span>
                      <span className="font-mono text-profit">~{potentialValue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp size={14} className={inv.color} />
                    <span className={`text-xs font-medium ${inv.color}`}>{inv.label}</span>
                    <div className="flex-1 bg-bg-tertiary rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-accent-primary rounded-full" style={{ width: `${inv.score}%` }} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          {investments.length === 0 && <div className="text-center text-text-secondary py-8">No Gold Live Series cards found.</div>}
        </div>
      ) : (
        <div className="space-y-3">
          {rosterUpdates.length > 0 ? rosterUpdates.slice(0, 20).map((ru: any, i: number) => (
            <div key={ru.id || i} className="bg-bg-secondary border border-border-subtle rounded-xl p-4 flex items-center gap-3">
              <Calendar size={18} className="text-text-tertiary" />
              <div>
                <div className="text-text-primary font-medium text-sm">{ru.name || `Roster Update #${ru.id}`}</div>
                {ru.date && <div className="text-text-tertiary text-xs">{new Date(ru.date).toLocaleDateString()}</div>}
              </div>
            </div>
          )) : (
            <div className="text-center text-text-secondary py-8">No roster updates available yet.</div>
          )}
          <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 mt-6">
            <h3 className="font-heading font-semibold text-text-primary mb-1">Historical Patterns</h3>
            <p className="text-text-secondary text-sm">
              Roster updates typically occur every 2 weeks on Fridays. Players performing well IRL get OVR boosts.
              Gold cards at 83-84 OVR are the prime investment targets — if they jump to 85+, they become Diamond and prices surge.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
