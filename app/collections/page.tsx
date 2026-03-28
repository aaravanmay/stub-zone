'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/lib/types';
import { TEAMS } from '@/lib/constants';
import { useOwnedCards } from '@/hooks/useOwnedCards';
import CollectionCard from '@/components/CollectionCard';
import CollectionPathOptimizer from '@/components/CollectionPathOptimizer';

const DIVISIONS: Record<string, string[]> = {
  'AL East': ['BAL', 'BOS', 'NYY', 'TB', 'TOR'],
  'AL Central': ['CWS', 'CLE', 'DET', 'KC', 'MIN'],
  'AL West': ['HOU', 'LAA', 'OAK', 'SEA', 'TEX'],
  'NL East': ['ATL', 'MIA', 'NYM', 'PHI', 'WAS'],
  'NL Central': ['CHC', 'CIN', 'MIL', 'PIT', 'STL'],
  'NL West': ['ARI', 'COL', 'LAD', 'SD', 'SF'],
};

export default function CollectionsPage() {
  const [tab, setTab] = useState<'collections' | 'optimizer'>('collections');
  const [teamListings, setTeamListings] = useState<Record<string, Listing[]>>({});
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(100000);
  const { ownedCards, toggleOwned } = useOwnedCards();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const results: Record<string, Listing[]> = {};
      const teamAbbrs = TEAMS.map(t => t.abbr);
      await Promise.all(teamAbbrs.map(async (abbr) => {
        try {
          const res = await fetch(`/api/listings?type=mlb_card&team=${abbr}&series_id=1337&page=1`);
          const data = await res.json();
          results[abbr] = data.listings || [];
          if (data.total_pages > 1) {
            const p2 = await fetch(`/api/listings?type=mlb_card&team=${abbr}&series_id=1337&page=2`);
            const d2 = await p2.json();
            results[abbr] = [...results[abbr], ...(d2.listings || [])];
          }
        } catch { results[abbr] = []; }
      }));
      setTeamListings(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const getTeamName = (abbr: string) => TEAMS.find(t => t.abbr === abbr)?.name || abbr;

  const collectionInfos = Object.entries(teamListings).map(([abbr, listings]) => ({
    team: getTeamName(abbr),
    cost: listings.filter(l => !ownedCards.includes(l.item.uuid)).reduce((s, l) => s + l.best_buy_price, 0),
    cardsNeeded: listings.filter(l => !ownedCards.includes(l.item.uuid)).length,
    totalCards: listings.length,
    rewardOVR: 90,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Collections</h1>

      <div className="flex gap-1.5 mb-6">
        {(['collections', 'optimizer'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${tab === t ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {t === 'collections' ? 'Collection Tracker' : 'Path Optimizer'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-bg-tertiary rounded-xl animate-pulse" />)}</div>
      ) : tab === 'collections' ? (
        <div className="space-y-6">
          {Object.entries(DIVISIONS).map(([div, teams]) => (
            <div key={div}>
              <h2 className="font-heading font-semibold text-text-secondary text-sm uppercase tracking-wider mb-3">{div}</h2>
              <div className="space-y-2">
                {teams.map(abbr => (
                  <CollectionCard key={abbr} teamName={getTeamName(abbr)} listings={teamListings[abbr] || []} ownedCards={ownedCards} onToggleOwned={toggleOwned} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <label className="text-text-secondary text-sm mb-1 block">Your Stubs</label>
            <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))}
              className="bg-bg-surface border border-border-default rounded-lg px-3 py-2 font-mono text-text-primary focus:border-accent-primary outline-none w-48" />
          </div>
          <CollectionPathOptimizer collections={collectionInfos} budget={budget} />
        </div>
      )}
    </div>
  );
}
