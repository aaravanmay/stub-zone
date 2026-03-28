'use client';

import { CONQUEST_MAPS } from '@/lib/conquest-data';
import { useConquestProgress } from '@/hooks/useConquestProgress';
import ConquestTracker from '@/components/ConquestTracker';

export default function ConquestPage() {
  const { progress, toggleReward, getMapCompletion, clearMap } = useConquestProgress();

  const totalRewards = CONQUEST_MAPS.reduce((s, m) => s + m.rewards.length, 0);
  const totalCollected = CONQUEST_MAPS.reduce((s, m) => s + (progress[m.id]?.length || 0), 0);
  const overallPct = totalRewards > 0 ? Math.round((totalCollected / totalRewards) * 100) : 0;
  const totalUncollected = CONQUEST_MAPS.reduce((s, m) =>
    s + m.rewards.filter(r => !(progress[m.id] || []).includes(r.id)).reduce((rs, r) => rs + r.estimatedValue, 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Conquest Reward Tracker</h1>

      {/* Overall Progress */}
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-secondary text-sm">Overall Progress</span>
          <span className="font-mono font-bold text-accent-primary">{overallPct}%</span>
        </div>
        <div className="w-full bg-bg-tertiary rounded-full h-3 overflow-hidden mb-2">
          <div className="h-full bg-accent-primary rounded-full transition-all" style={{ width: `${overallPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-text-tertiary">
          <span>{totalCollected}/{totalRewards} rewards collected</span>
          <span>{totalUncollected.toLocaleString()} stubs uncollected</span>
        </div>
      </div>

      <ConquestTracker
        maps={CONQUEST_MAPS}
        progress={progress}
        onToggle={toggleReward}
        getCompletion={getMapCompletion}
        onClearMap={clearMap}
      />
    </div>
  );
}
