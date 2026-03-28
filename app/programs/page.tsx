'use client';

import { useState, useEffect, useMemo } from 'react';
import { Target, Swords, Trophy, Gamepad2, Star as StarIcon, Zap, Gift, Shirt, Award, TrendingUp } from 'lucide-react';
import { useTeam } from '@/hooks/useTeam';
import { Item } from '@/lib/types';
import { calculateMetaScore } from '@/lib/calculations';

interface Program {
  name: string;
  icon: React.ElementType;
  category: 'mode' | 'program';
  stubsHr: number;
  xpHr: number;
  difficulty: number;
  best: string;
  color: string;
  cardRewards: CardReward[];
}

interface CardReward {
  name: string;
  ovr: number;
  position: string;
  rarity: string;
  milestone: string;
}

const PROGRAMS: Program[] = [
  {
    name: 'Featured Program',
    icon: StarIcon,
    category: 'program',
    stubsHr: 5000,
    xpHr: 6000,
    difficulty: 2,
    best: 'Main program with top-tier boss cards at milestones',
    color: 'text-rarity-diamond',
    cardRewards: [
      { name: 'Featured Boss (Choice)', ovr: 97, position: 'Various', rarity: 'Diamond', milestone: '300K XP' },
      { name: 'Mid-Tier Boss', ovr: 94, position: 'Various', rarity: 'Diamond', milestone: '150K XP' },
      { name: 'Program Pack x5', ovr: 0, position: '', rarity: 'Gold+', milestone: '50K-250K XP' },
    ],
  },
  {
    name: 'New Threads',
    icon: Shirt,
    category: 'program',
    stubsHr: 3500,
    xpHr: 4000,
    difficulty: 2,
    best: 'New card series with fresh art. Collectible for big rewards',
    color: 'text-accent-primary',
    cardRewards: [
      { name: 'New Threads Diamond', ovr: 95, position: 'Various', rarity: 'Diamond', milestone: 'Collection Complete' },
      { name: 'New Threads Cards', ovr: 88, position: 'Various', rarity: 'Gold-Diamond', milestone: 'Pack Pulls / Market' },
    ],
  },
  {
    name: 'Team Affinity',
    icon: Award,
    category: 'program',
    stubsHr: 4000,
    xpHr: 3500,
    difficulty: 2,
    best: 'Grind for each MLB team to unlock powerful team-specific cards',
    color: 'text-warning',
    cardRewards: [
      { name: 'Team Legend', ovr: 93, position: 'Various', rarity: 'Diamond', milestone: 'Team Affinity Complete' },
      { name: 'Team Pack Rewards', ovr: 0, position: '', rarity: 'Various', milestone: 'Throughout path' },
    ],
  },
  {
    name: 'Monthly Awards',
    icon: Trophy,
    category: 'program',
    stubsHr: 2500,
    xpHr: 3000,
    difficulty: 2,
    best: 'Monthly lightning cards and best performers. Great collection pieces',
    color: 'text-profit',
    cardRewards: [
      { name: 'Lightning Player', ovr: 96, position: 'Various', rarity: 'Diamond', milestone: 'Monthly Boss' },
      { name: 'POTM Cards', ovr: 90, position: 'Various', rarity: 'Diamond', milestone: 'Moments / Collection' },
    ],
  },
  {
    name: 'Mini Seasons',
    icon: Gamepad2,
    category: 'mode',
    stubsHr: 4500,
    xpHr: 3500,
    difficulty: 2,
    best: 'Consistent rewards with minimal stress. Good packs and stubs',
    color: 'text-profit',
    cardRewards: [
      { name: 'Mini Season Reward', ovr: 92, position: 'Various', rarity: 'Diamond', milestone: 'Win Championship' },
    ],
  },
  {
    name: 'Battle Royale',
    icon: Swords,
    category: 'mode',
    stubsHr: 5000,
    xpHr: 3000,
    difficulty: 4,
    best: 'High ceiling rewards if you can go 12-0',
    color: 'text-rarity-diamond',
    cardRewards: [
      { name: 'BR Flawless Reward', ovr: 97, position: 'Various', rarity: 'Diamond', milestone: '12-0 Run' },
      { name: 'BR Reward Cards', ovr: 93, position: 'Various', rarity: 'Diamond', milestone: '9+ Wins' },
    ],
  },
  {
    name: 'Events',
    icon: Trophy,
    category: 'mode',
    stubsHr: 4000,
    xpHr: 2500,
    difficulty: 3,
    best: 'Great card rewards at cumulative win milestones',
    color: 'text-warning',
    cardRewards: [
      { name: 'Event Reward', ovr: 95, position: 'Various', rarity: 'Diamond', milestone: '30 Cumulative Wins' },
    ],
  },
  {
    name: 'Ranked Seasons',
    icon: StarIcon,
    category: 'mode',
    stubsHr: 3500,
    xpHr: 4000,
    difficulty: 5,
    best: 'Best XP and prestige rewards for competitive players',
    color: 'text-loss',
    cardRewards: [
      { name: 'World Series Reward', ovr: 98, position: 'Various', rarity: 'Diamond', milestone: 'World Series' },
      { name: 'Season Reward', ovr: 94, position: 'Various', rarity: 'Diamond', milestone: 'Division Series+' },
    ],
  },
  {
    name: 'Conquest',
    icon: Target,
    category: 'mode',
    stubsHr: 3000,
    xpHr: 2000,
    difficulty: 1,
    best: 'Relaxed with hidden rewards. Good for stubs and packs',
    color: 'text-accent-primary',
    cardRewards: [
      { name: 'Conquest Hidden Reward', ovr: 90, position: 'Various', rarity: 'Diamond', milestone: 'Map Completion' },
    ],
  },
  {
    name: 'Moments',
    icon: Zap,
    category: 'mode',
    stubsHr: 1000,
    xpHr: 5000,
    difficulty: 2,
    best: 'Best XP/hr for program grinding. Quick sessions',
    color: 'text-info',
    cardRewards: [],
  },
];

type SortKey = 'stubsHr' | 'xpHr' | 'difficulty';
type CategoryFilter = 'all' | 'mode' | 'program';

export default function ProgramsPage() {
  const [sortBy, setSortBy] = useState<SortKey>('stubsHr');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const { team } = useTeam();

  const filledPositions = useMemo(() => {
    return Object.entries(team)
      .filter(([, p]) => p !== null)
      .map(([slot, p]) => ({ slot, player: p as Item }));
  }, [team]);

  const hasTeam = filledPositions.length >= 3;

  const filtered = PROGRAMS
    .filter(p => category === 'all' || p.category === category)
    .sort((a, b) => sortBy === 'difficulty' ? a.difficulty - b.difficulty : b[sortBy] - a[sortBy]);

  const getTeamRecommendation = (program: Program): string | null => {
    if (!hasTeam || program.cardRewards.length === 0) return null;

    for (const reward of program.cardRewards) {
      if (reward.ovr === 0) continue;
      // Check if any team position would benefit from this reward
      for (const { slot, player } of filledPositions) {
        const pos = slot.replace(/\d+$/, '');
        if (reward.position === 'Various' || reward.position === pos) {
          if (reward.ovr > player.ovr) {
            const metaCurrent = calculateMetaScore(player, pos);
            return `${reward.name} (${reward.ovr} OVR) could upgrade your ${slot} from ${player.name} (${player.ovr} OVR). Current meta score: ${metaCurrent.toFixed(0)}`;
          }
        }
      }
    }
    return null;
  };

  // Find weakest position for personalized recs
  const weakestPos = hasTeam
    ? filledPositions.reduce((min, cur) => cur.player.ovr < min.player.ovr ? cur : min)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Program & Mode Advisor</h1>

      {hasTeam && weakestPos && (
        <div className="bg-gradient-to-r from-accent-primary/10 to-transparent border border-accent-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-accent-primary" />
            <span className="text-accent-primary font-semibold text-sm">Personalized Tip</span>
          </div>
          <p className="text-text-secondary text-sm">
            Your weakest position is <span className="text-text-primary font-medium">{weakestPos.slot}</span> ({weakestPos.player.name}, {weakestPos.player.ovr} OVR).
            Programs marked with upgrade tips below can help fill that gap.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {[
          { key: 'all' as CategoryFilter, label: 'All' },
          { key: 'program' as CategoryFilter, label: 'Programs' },
          { key: 'mode' as CategoryFilter, label: 'Game Modes' },
        ].map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${category === c.key ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 mb-6">
        {[{ key: 'stubsHr' as SortKey, label: 'Stubs/hr' }, { key: 'xpHr' as SortKey, label: 'XP/hr' }, { key: 'difficulty' as SortKey, label: 'Easiest' }].map(s => (
          <button key={s.key} onClick={() => setSortBy(s.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${sortBy === s.key ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((program, idx) => {
          const recommendation = getTeamRecommendation(program);
          return (
            <div key={program.name} className="bg-bg-secondary border border-border-subtle rounded-xl p-5 hover:bg-bg-tertiary transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-mono text-text-tertiary text-sm w-6">#{idx + 1}</span>
                <program.icon size={24} className={program.color} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-text-primary">{program.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${program.category === 'program' ? 'bg-accent-primary/10 text-accent-primary' : 'bg-info/10 text-info'}`}>
                      {program.category === 'program' ? 'Program' : 'Mode'}
                    </span>
                  </div>
                  <div className="text-text-secondary text-sm mt-0.5">{program.best}</div>
                </div>
                <div className="hidden sm:grid grid-cols-3 gap-6 text-right">
                  <div>
                    <div className="text-text-tertiary text-xs">Stubs/hr</div>
                    <div className="font-mono font-bold text-profit">{program.stubsHr.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-text-tertiary text-xs">XP/hr</div>
                    <div className="font-mono font-bold text-info">{program.xpHr.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-text-tertiary text-xs">Difficulty</div>
                    <div className="text-warning">{'★'.repeat(program.difficulty)}{'☆'.repeat(5 - program.difficulty)}</div>
                  </div>
                </div>
              </div>

              {/* Card Rewards */}
              {program.cardRewards.length > 0 && (
                <div className="mt-3 ml-14 space-y-1.5">
                  <div className="text-text-tertiary text-xs uppercase tracking-wider">Card Rewards</div>
                  {program.cardRewards.map((reward, ri) => (
                    <div key={ri} className="flex items-center gap-3 text-sm">
                      <Gift size={14} className="text-rarity-gold flex-shrink-0" />
                      <span className="text-text-primary">{reward.name}</span>
                      {reward.ovr > 0 && (
                        <span className="font-mono text-accent-primary text-xs">{reward.ovr} OVR</span>
                      )}
                      <span className="text-text-tertiary text-xs">{reward.rarity}</span>
                      <span className="text-text-tertiary text-xs ml-auto">{reward.milestone}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Team-based recommendation */}
              {recommendation && (
                <div className="mt-3 ml-14 bg-accent-primary/5 border border-accent-primary/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-accent-primary flex-shrink-0" />
                    <span className="text-accent-primary text-xs font-medium">Team Upgrade Tip:</span>
                  </div>
                  <p className="text-text-secondary text-xs mt-1">{recommendation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-bg-secondary border border-border-subtle rounded-xl p-5">
        <h3 className="font-heading font-semibold text-text-primary mb-2">How to Use</h3>
        <p className="text-text-secondary text-sm">
          Build your team first in the My Team section. Programs and modes above will then show personalized
          upgrade recommendations based on your current roster's weakest positions.
          Estimates are based on community averages — your results will vary by skill and luck.
        </p>
      </div>
    </div>
  );
}
