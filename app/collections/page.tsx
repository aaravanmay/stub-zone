'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/lib/types';
import { TEAMS } from '@/lib/constants';
import { useOwnedCards } from '@/hooks/useOwnedCards';
import CollectionCard from '@/components/CollectionCard';
import CollectionPathOptimizer from '@/components/CollectionPathOptimizer';
import { Trophy, Star, Gift, Shirt, Award, Zap } from 'lucide-react';

const DIVISIONS: Record<string, string[]> = {
  'AL East': ['BAL', 'BOS', 'NYY', 'TB', 'TOR'],
  'AL Central': ['CWS', 'CLE', 'DET', 'KC', 'MIN'],
  'AL West': ['HOU', 'LAA', 'OAK', 'SEA', 'TEX'],
  'NL East': ['ATL', 'MIA', 'NYM', 'PHI', 'WAS'],
  'NL Central': ['CHC', 'CIN', 'MIL', 'PIT', 'STL'],
  'NL West': ['ARI', 'COL', 'LAD', 'SD', 'SF'],
};

interface ProgramCollection {
  name: string;
  icon: React.ElementType;
  description: string;
  rewardName: string;
  rewardOVR: number;
  rewardType: 'player' | 'packs' | 'stubs';
  estimatedCost: number;
  cardsNeeded: number;
  worth: number; // 1-5 rating
  series: string;
}

const PROGRAM_COLLECTIONS: ProgramCollection[] = [
  {
    name: 'Live Series Collection',
    icon: Trophy,
    description: 'Collect all Live Series cards from every MLB team',
    rewardName: 'Collection Reward (99 OVR Boss)',
    rewardOVR: 99,
    rewardType: 'player',
    estimatedCost: 1500000,
    cardsNeeded: 900,
    worth: 5,
    series: 'Live',
  },
  {
    name: 'New Threads Collection',
    icon: Shirt,
    description: 'Collect all New Threads series cards for exclusive rewards',
    rewardName: 'New Threads Collection Reward',
    rewardOVR: 96,
    rewardType: 'player',
    estimatedCost: 200000,
    cardsNeeded: 30,
    worth: 5,
    series: 'New Threads',
  },
  {
    name: 'Future Stars Collection',
    icon: Star,
    description: 'Collect Future Stars and Prospect cards',
    rewardName: 'Future Stars Boss',
    rewardOVR: 95,
    rewardType: 'player',
    estimatedCost: 150000,
    cardsNeeded: 25,
    worth: 4,
    series: 'Future Stars',
  },
  {
    name: 'Monthly Awards Collection',
    icon: Award,
    description: 'Collect all Monthly Awards cards for lightning players',
    rewardName: 'Monthly Awards Boss',
    rewardOVR: 97,
    rewardType: 'player',
    estimatedCost: 250000,
    cardsNeeded: 40,
    worth: 5,
    series: 'Monthly Awards',
  },
  {
    name: 'Breakout Collection',
    icon: Zap,
    description: 'Collect Breakout series cards from various programs',
    rewardName: 'Breakout Pack Bundle',
    rewardOVR: 0,
    rewardType: 'packs',
    estimatedCost: 100000,
    cardsNeeded: 20,
    worth: 3,
    series: 'Breakout',
  },
  {
    name: 'All-Star Collection',
    icon: Star,
    description: 'Collect All-Star series cards for rewards',
    rewardName: 'All-Star Choice Pack',
    rewardOVR: 0,
    rewardType: 'packs',
    estimatedCost: 120000,
    cardsNeeded: 25,
    worth: 3,
    series: 'All-Star',
  },
  {
    name: 'Awards Collection',
    icon: Trophy,
    description: 'Collect Awards series cards for top-tier rewards',
    rewardName: 'Awards Collection Boss',
    rewardOVR: 96,
    rewardType: 'player',
    estimatedCost: 300000,
    cardsNeeded: 35,
    worth: 4,
    series: 'Awards',
  },
  {
    name: 'Signature Series Collection',
    icon: Gift,
    description: 'Collect Signature Series cards for endgame rewards',
    rewardName: 'Signature Series Boss',
    rewardOVR: 98,
    rewardType: 'player',
    estimatedCost: 400000,
    cardsNeeded: 30,
    worth: 5,
    series: 'Signature',
  },
];

export default function CollectionsPage() {
  const [tab, setTab] = useState<'live' | 'programs' | 'optimizer'>('live');
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

  const sortedProgramCollections = [...PROGRAM_COLLECTIONS].sort((a, b) => b.worth - a.worth);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Collections</h1>

      <div className="flex gap-1.5 mb-6">
        {([
          { key: 'live' as const, label: 'Live Series' },
          { key: 'programs' as const, label: 'Program Collections' },
          { key: 'optimizer' as const, label: 'Path Optimizer' },
        ]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${tab === t.key ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && tab === 'live' ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-bg-tertiary rounded-xl animate-pulse" />)}</div>
      ) : tab === 'live' ? (
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
      ) : tab === 'programs' ? (
        <div className="space-y-4">
          <div className="bg-bg-secondary border border-accent-primary/20 rounded-xl p-4 mb-4">
            <h3 className="font-heading font-semibold text-text-primary mb-1">Collection Priority Guide</h3>
            <p className="text-text-secondary text-sm">
              Collections ranked by value. Player rewards are most valuable — they give you untradeable cards
              that can anchor your lineup. Pack rewards provide tradeable value.
            </p>
          </div>

          {sortedProgramCollections.map(collection => {
            const Icon = collection.icon;
            const isPlayerReward = collection.rewardType === 'player';

            return (
              <div key={collection.name} className={`bg-bg-secondary border rounded-xl p-5 ${isPlayerReward ? 'border-accent-primary/20' : 'border-border-subtle'}`}>
                <div className="flex items-start gap-4">
                  <Icon size={24} className={isPlayerReward ? 'text-accent-primary' : 'text-text-secondary'} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-text-primary">{collection.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isPlayerReward ? 'bg-accent-primary/10 text-accent-primary' :
                        collection.rewardType === 'packs' ? 'bg-rarity-gold/10 text-rarity-gold' :
                        'bg-profit/10 text-profit'
                      }`}>
                        {isPlayerReward ? 'Player Reward' : collection.rewardType === 'packs' ? 'Pack Reward' : 'Stubs Reward'}
                      </span>
                      <div className="ml-auto flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-xs ${i < collection.worth ? 'text-warning' : 'text-text-tertiary/30'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm mb-2">{collection.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-text-tertiary text-xs">Reward</span>
                        <div className="text-text-primary font-medium">
                          {collection.rewardName}
                          {collection.rewardOVR > 0 && (
                            <span className="ml-1 font-mono text-accent-primary">{collection.rewardOVR} OVR</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-text-tertiary text-xs">Est. Cost</span>
                        <div className="font-mono text-text-primary">{collection.estimatedCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-text-tertiary text-xs">Cards Needed</span>
                        <div className="font-mono text-text-primary">{collection.cardsNeeded}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
