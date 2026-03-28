'use client';

import { useState } from 'react';
import { Target, Swords, Trophy, Gamepad2, Star as StarIcon, Zap } from 'lucide-react';

const MODES = [
  { name: 'Mini Seasons', icon: Gamepad2, stubsHr: 4500, xpHr: 3500, difficulty: 2, best: 'Consistent rewards with minimal stress', color: 'text-profit' },
  { name: 'Battle Royale', icon: Swords, stubsHr: 5000, xpHr: 3000, difficulty: 4, best: 'High ceiling if you can win 12 games', color: 'text-rarity-diamond' },
  { name: 'Events', icon: Trophy, stubsHr: 4000, xpHr: 2500, difficulty: 3, best: 'Great card rewards at win milestones', color: 'text-warning' },
  { name: 'Ranked Seasons', icon: StarIcon, stubsHr: 3500, xpHr: 4000, difficulty: 5, best: 'Best XP and prestige rewards', color: 'text-loss' },
  { name: 'Conquest', icon: Target, stubsHr: 3000, xpHr: 2000, difficulty: 1, best: 'Relaxed, hidden rewards on each map', color: 'text-accent-primary' },
  { name: 'Moments', icon: Zap, stubsHr: 1000, xpHr: 5000, difficulty: 2, best: 'Best XP/hr for program grinding', color: 'text-info' },
];

export default function ProgramsPage() {
  const [sortBy, setSortBy] = useState<'stubsHr' | 'xpHr' | 'difficulty'>('stubsHr');

  const sorted = [...MODES].sort((a, b) => sortBy === 'difficulty' ? a.difficulty - b.difficulty : b[sortBy] - a[sortBy]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Program & Mode Advisor</h1>

      <div className="flex gap-1.5 mb-6">
        {[{ key: 'stubsHr', label: 'Stubs/hr' }, { key: 'xpHr', label: 'XP/hr' }, { key: 'difficulty', label: 'Easiest' }].map(s => (
          <button key={s.key} onClick={() => setSortBy(s.key as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${sortBy === s.key ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map((mode, idx) => (
          <div key={mode.name} className="bg-bg-secondary border border-border-subtle rounded-xl p-5 flex items-center gap-4 hover:bg-bg-tertiary transition-colors">
            <span className="font-mono text-text-tertiary text-sm w-6">#{idx + 1}</span>
            <mode.icon size={24} className={mode.color} />
            <div className="flex-1 min-w-0">
              <div className="font-heading font-semibold text-text-primary">{mode.name}</div>
              <div className="text-text-secondary text-sm mt-0.5">{mode.best}</div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-right">
              <div>
                <div className="text-text-tertiary text-xs">Stubs/hr</div>
                <div className="font-mono font-bold text-profit">{mode.stubsHr.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-text-tertiary text-xs">XP/hr</div>
                <div className="font-mono font-bold text-info">{mode.xpHr.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-text-tertiary text-xs">Difficulty</div>
                <div className="text-warning">{'★'.repeat(mode.difficulty)}{'☆'.repeat(5 - mode.difficulty)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-bg-secondary border border-border-subtle rounded-xl p-5">
        <h3 className="font-heading font-semibold text-text-primary mb-2">How to Use</h3>
        <p className="text-text-secondary text-sm">
          These estimates are based on community averages. Your actual results will vary based on skill level and luck.
          Build your team first, then check back here — modes that reward cards you need will be highlighted.
        </p>
      </div>
    </div>
  );
}
