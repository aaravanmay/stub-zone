'use client';

interface CollectionInfo {
  team: string;
  cost: number;
  cardsNeeded: number;
  totalCards: number;
  rewardOVR: number;
}

interface Props {
  collections: CollectionInfo[];
  budget: number;
}

export default function CollectionPathOptimizer({ collections, budget }: Props) {
  const sorted = [...collections]
    .filter(c => c.cardsNeeded > 0)
    .map(c => ({ ...c, valueScore: c.rewardOVR / Math.max(c.cost, 1) }))
    .sort((a, b) => b.valueScore - a.valueScore);

  let runningCost = 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-text-secondary text-sm">Budget:</span>
        <span className="font-mono font-bold text-accent-primary text-lg">{budget.toLocaleString()} stubs</span>
      </div>
      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border-default" />
        {sorted.map((c, i) => {
          runningCost += c.cost;
          const affordable = runningCost <= budget;
          return (
            <div key={c.team} className={`relative mb-4 ${!affordable ? 'opacity-40' : ''}`}>
              <div className={`absolute -left-4 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${affordable ? 'bg-accent-primary border-accent-primary text-bg-primary' : 'bg-bg-tertiary border-border-default text-text-tertiary'}`}>
                {i + 1}
              </div>
              <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 ml-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-semibold text-text-primary">{c.team}</span>
                  <span className="font-mono text-sm text-text-secondary">{c.cost.toLocaleString()} stubs</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span>{c.cardsNeeded} cards needed</span>
                  <span>Reward: {c.rewardOVR} OVR</span>
                  <span className={`font-mono ${affordable ? 'text-profit' : 'text-loss'}`}>Running: {runningCost.toLocaleString()}</span>
                </div>
                <div className="w-full bg-bg-tertiary rounded-full h-1.5 mt-2">
                  <div className="h-full bg-accent-primary rounded-full" style={{ width: `${((c.totalCards - c.cardsNeeded) / c.totalCards) * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {sorted.length === 0 && <div className="text-center text-text-secondary py-8">All collections complete!</div>}
    </div>
  );
}
