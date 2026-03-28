'use client';

import { useState } from 'react';
import PackEVCalculator from '@/components/PackEVCalculator';
import PackSimulator from '@/components/PackSimulator';

export default function PacksPage() {
  const [tab, setTab] = useState<'ev' | 'simulator'>('ev');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Pack Simulator & EV Calculator</h1>
      <div className="flex gap-1.5 mb-6">
        {[{ key: 'ev', label: 'Expected Value' }, { key: 'simulator', label: 'Pack Opener' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${tab === t.key ? 'bg-[rgba(6,214,160,0.12)] border-accent-primary text-accent-primary' : 'border-border-default text-text-secondary hover:border-border-hover'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'ev' ? <PackEVCalculator /> : <PackSimulator />}
    </div>
  );
}
