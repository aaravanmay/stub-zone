'use client';

import BudgetPieChart from './BudgetPieChart';

interface Props {
  budget: number;
}

export default function BudgetPlanner({ budget }: Props) {
  const flipping = Math.round(budget * 0.35);
  const upgrades = Math.round(budget * 0.30);
  const collections = Math.round(budget * 0.20);
  const investments = Math.round(budget * 0.15);

  const flippingTier = budget < 10000 ? 'Gold card flips (high volume, 200-500 profit each)' :
    budget < 100000 ? 'Diamond flips (1K-5K profit, moderate volume)' :
    'Big-ticket Diamond flips (5K-20K profit per flip)';

  const allocations = [
    { name: 'Flipping', value: flipping, color: '#06d6a0' },
    { name: 'Team Upgrades', value: upgrades, color: '#118ab2' },
    { name: 'Collections', value: collections, color: '#ffd166' },
    { name: 'Investments', value: investments, color: '#ef476f' },
  ];

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <BudgetPieChart allocations={allocations} />
        <div className="space-y-3">
          {allocations.map(a => (
            <div key={a.name} className="bg-bg-secondary border border-border-subtle rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ background: a.color }} />
                <span className="font-heading font-semibold text-text-primary text-sm">{a.name}</span>
                <span className="ml-auto font-mono font-bold text-text-primary">{a.value.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-profit" />
            <h3 className="font-heading font-semibold text-text-primary">Flipping Capital — {flipping.toLocaleString()} stubs</h3>
          </div>
          <p className="text-text-secondary text-sm">{flippingTier}</p>
          <p className="text-text-tertiary text-xs mt-1">Set aside this amount to continuously flip cards. Check the Flipping page for current best opportunities.</p>
        </div>

        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-info" />
            <h3 className="font-heading font-semibold text-text-primary">Team Upgrades — {upgrades.toLocaleString()} stubs</h3>
          </div>
          <p className="text-text-secondary text-sm">Visit My Team to see your weakest positions, then use this budget for the highest value-per-stub upgrades.</p>
        </div>

        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <h3 className="font-heading font-semibold text-text-primary">Collections — {collections.toLocaleString()} stubs</h3>
          </div>
          <p className="text-text-secondary text-sm">Check the Collection Path Optimizer to find which collections give the best rewards within your budget.</p>
        </div>

        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-loss" />
            <h3 className="font-heading font-semibold text-text-primary">Investments — {investments.toLocaleString()} stubs</h3>
          </div>
          <p className="text-text-secondary text-sm">Check the Roster Predictor for Gold cards at 83-84 OVR that might go Diamond. Buy low, sell after upgrade.</p>
        </div>
      </div>
    </div>
  );
}
