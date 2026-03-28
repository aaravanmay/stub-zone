'use client';

import { useState } from 'react';
import { FlipLogEntry } from '@/lib/types';
import { Trash2 } from 'lucide-react';

interface Props {
  flipLog: FlipLogEntry[];
  onAddFlip: (entry: Omit<FlipLogEntry, 'id' | 'profit'>) => void;
  onRemoveFlip: (id: string) => void;
}

export default function FlipLog({ flipLog, onAddFlip, onRemoveFlip }: Props) {
  const [cardName, setCardName] = useState('');
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);

  const previewProfit = Math.floor(sellPrice * 0.9) - buyPrice;

  const handleSubmit = () => {
    if (!cardName || !buyPrice || !sellPrice) return;
    onAddFlip({ cardName, buyPrice, sellPrice, date: new Date().toISOString() });
    setCardName('');
    setBuyPrice(0);
    setSellPrice(0);
  };

  return (
    <div>
      {/* Add Form */}
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 mb-6">
        <h3 className="font-heading font-semibold text-text-primary mb-3">Log a Flip</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input type="text" placeholder="Card name" value={cardName} onChange={e => setCardName(e.target.value)}
            className="bg-bg-surface border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-accent-primary outline-none" />
          <input type="number" placeholder="Buy price" value={buyPrice || ''} onChange={e => setBuyPrice(Number(e.target.value))}
            className="bg-bg-surface border border-border-default rounded-lg px-3 py-2 text-sm font-mono text-text-primary placeholder-text-tertiary focus:border-accent-primary outline-none" />
          <input type="number" placeholder="Sell price" value={sellPrice || ''} onChange={e => setSellPrice(Number(e.target.value))}
            className="bg-bg-surface border border-border-default rounded-lg px-3 py-2 text-sm font-mono text-text-primary placeholder-text-tertiary focus:border-accent-primary outline-none" />
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm font-bold ${previewProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
              {previewProfit > 0 ? '+' : ''}{previewProfit.toLocaleString()}
            </span>
            <button onClick={handleSubmit}
              className="px-4 py-2 bg-accent-primary text-bg-primary rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors">
              Log
            </button>
          </div>
        </div>
      </div>

      {/* Log Table */}
      {flipLog.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {['Date', 'Card', 'Buy', 'Sell', 'Profit', ''].map(h => (
                  <th key={h} className="p-2 text-xs text-text-secondary uppercase text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flipLog.map(f => (
                <tr key={f.id} className="border-b border-border-subtle/50 odd:bg-white/[0.02]">
                  <td className="p-2 text-sm text-text-secondary">{new Date(f.date).toLocaleDateString()}</td>
                  <td className="p-2 text-sm text-text-primary">{f.cardName}</td>
                  <td className="p-2 font-mono text-sm">{f.buyPrice.toLocaleString()}</td>
                  <td className="p-2 font-mono text-sm">{f.sellPrice.toLocaleString()}</td>
                  <td className={`p-2 font-mono text-sm font-semibold ${f.profit >= 0 ? 'text-profit' : 'text-loss'}`}>{f.profit.toLocaleString()}</td>
                  <td className="p-2"><button onClick={() => onRemoveFlip(f.id)} className="text-text-tertiary hover:text-loss"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-text-secondary py-8">No flips logged yet. Start tracking your profits above!</div>
      )}
    </div>
  );
}
