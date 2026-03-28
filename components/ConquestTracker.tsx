'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Package, Coins, Zap, User, Shirt } from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  type: string;
  estimatedValue: number;
}

interface ConquestMap {
  id: string;
  name: string;
  rewards: Reward[];
  estimatedMinutes: number;
}

interface Props {
  maps: ConquestMap[];
  progress: Record<string, string[]>;
  onToggle: (mapId: string, rewardId: string) => void;
  getCompletion: (mapId: string, total: number) => number;
  onClearMap: (mapId: string) => void;
}

const typeIcons: Record<string, any> = {
  pack: Package, stubs: Coins, xp: Zap, player: User, equipment: Shirt,
};

export default function ConquestTracker({ maps, progress, onToggle, getCompletion, onClearMap }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {maps.map(map => {
        const pct = getCompletion(map.id, map.rewards.length);
        const collected = progress[map.id]?.length || 0;
        const uncollectedValue = map.rewards
          .filter(r => !(progress[map.id] || []).includes(r.id))
          .reduce((s, r) => s + r.estimatedValue, 0);
        const isExpanded = expanded === map.id;

        return (
          <div key={map.id} className="bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden">
            <button onClick={() => setExpanded(isExpanded ? null : map.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-bg-tertiary transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-heading font-semibold text-text-primary">{map.name}</span>
                <span className="text-text-tertiary text-xs">{collected}/{map.rewards.length}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <span className="text-text-tertiary text-xs">{uncollectedValue.toLocaleString()} stubs remaining</span>
                </div>
                <div className="w-24 bg-bg-tertiary rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-profit' : 'bg-accent-primary'}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="font-mono text-xs text-text-secondary w-10 text-right">{pct}%</span>
                {isExpanded ? <ChevronUp size={16} className="text-text-tertiary" /> : <ChevronDown size={16} className="text-text-tertiary" />}
              </div>
            </button>
            {isExpanded && (
              <div className="border-t border-border-subtle p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-text-tertiary text-xs">~{map.estimatedMinutes} min to complete</span>
                  <button onClick={() => { if (confirm(`Clear all progress for ${map.name}?`)) onClearMap(map.id); }}
                    className="text-xs text-loss hover:underline">Clear Progress</button>
                </div>
                <div className="grid gap-2">
                  {map.rewards.map(reward => {
                    const isCollected = (progress[map.id] || []).includes(reward.id);
                    const Icon = typeIcons[reward.type] || Package;
                    return (
                      <label key={reward.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${isCollected ? 'opacity-50 bg-profit/5' : 'hover:bg-bg-tertiary'}`}>
                        <input type="checkbox" checked={isCollected} onChange={() => onToggle(map.id, reward.id)}
                          className="accent-accent-primary w-4 h-4" />
                        <Icon size={16} className="text-text-tertiary" />
                        <span className={`text-sm flex-1 ${isCollected ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>{reward.name}</span>
                        <span className="font-mono text-xs text-text-secondary">{reward.estimatedValue.toLocaleString()}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
