'use client';

import { useState } from 'react';
import BudgetPlanner from '@/components/BudgetPlanner';

export default function BudgetPage() {
  const [budget, setBudget] = useState<number>(0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Stub Budget Planner</h1>

      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 mb-8">
        <label className="block text-text-secondary text-sm mb-2">How many stubs do you have?</label>
        <input
          type="number"
          value={budget || ''}
          onChange={(e) => setBudget(Number(e.target.value))}
          placeholder="Enter your stub count..."
          className="w-full md:w-64 bg-bg-surface border border-border-default rounded-lg px-4 py-3 font-mono text-xl text-text-primary placeholder-text-tertiary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none"
        />
      </div>

      {budget > 0 ? (
        <BudgetPlanner budget={budget} />
      ) : (
        <div className="text-center text-text-secondary py-16">
          Enter your stub count above to get a personalized spend plan.
        </div>
      )}
    </div>
  );
}
