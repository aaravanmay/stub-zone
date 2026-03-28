'use client';

import { Item } from '@/lib/types';
import PlayerSearchAutocomplete from './PlayerSearchAutocomplete';

interface Props {
  team: Record<string, Item | null>;
  setPlayer: (pos: string, item: Item) => void;
  removePlayer: (pos: string) => void;
  resetTeam: () => void;
  teamOVR: number;
}

const LINEUP_SLOTS = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
const SP_SLOTS = ['SP1', 'SP2', 'SP3', 'SP4', 'SP5'];
const BP_SLOTS = ['BP1', 'BP2', 'BP3', 'BP4', 'BP5', 'BP6', 'BP7'];

function SlotGroup({ title, slots, team, setPlayer, removePlayer }: {
  title: string; slots: string[];
  team: Record<string, Item | null>;
  setPlayer: (pos: string, item: Item) => void;
  removePlayer: (pos: string) => void;
}) {
  return (
    <div className="mb-8">
      <h3 className="font-heading font-semibold text-text-primary mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {slots.map(slot => {
          const label = slot.replace(/\d+$/, ' ').trim() + (slot.match(/\d+$/) ? ` ${slot.match(/\d+$/)?.[0]}` : '');
          return (
            <div key={slot}>
              <div className="text-text-tertiary text-xs font-medium uppercase tracking-wider mb-1.5">{label}</div>
              <PlayerSearchAutocomplete
                position={slot.replace(/\d+$/, '')}
                currentPlayer={team[slot] || null}
                onSelect={(item) => setPlayer(slot, item)}
                onClear={() => removePlayer(slot)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TeamBuilder({ team, setPlayer, removePlayer, resetTeam, teamOVR }: Props) {
  const filledCount = Object.values(team).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-bg-secondary border border-border-subtle rounded-xl px-4 py-2">
            <span className="text-text-secondary text-xs">Team OVR</span>
            <span className="font-mono font-bold text-xl text-accent-primary ml-2">{teamOVR || '—'}</span>
          </div>
          <div className="text-text-secondary text-sm">{filledCount}/20 slots filled</div>
        </div>
        <button
          onClick={() => { if (confirm('Reset your entire team?')) resetTeam(); }}
          className="px-3 py-1.5 rounded-lg border border-loss/30 text-loss text-sm hover:bg-loss/10 transition-colors"
        >
          Reset Team
        </button>
      </div>

      <SlotGroup title="Starting Lineup" slots={LINEUP_SLOTS} team={team} setPlayer={setPlayer} removePlayer={removePlayer} />
      <SlotGroup title="Starting Rotation" slots={SP_SLOTS} team={team} setPlayer={setPlayer} removePlayer={removePlayer} />
      <SlotGroup title="Bullpen" slots={BP_SLOTS} team={team} setPlayer={setPlayer} removePlayer={removePlayer} />
    </div>
  );
}
