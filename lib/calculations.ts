import { TAX_RATE } from './constants';
import { META_WEIGHTS, ELITE_QUIRKS } from './meta-weights';
import type { CompletedOrder, Item } from './types';

export function calculateFlip(
  bestBuyPrice: number,
  bestSellPrice: number
): { tax: number; profit: number; margin: number } {
  const tax = Math.floor(bestSellPrice * TAX_RATE);
  const profit = bestSellPrice - tax - bestBuyPrice;
  const margin =
    bestBuyPrice > 0 ? ((profit / bestBuyPrice) * 100) : 0;
  return { tax, profit, margin };
}

export function calculateProfitPerMinute(
  profit: number,
  completedOrders: CompletedOrder[]
): number {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const recentOrders = completedOrders.filter(
    (order) => new Date(order.date).getTime() >= oneHourAgo
  );
  const ordersPerMinute = recentOrders.length / 60;
  return profit * ordersPerMinute;
}

export function calculateSalesVelocity(
  completedOrders: CompletedOrder[]
): number {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const recentOrders = completedOrders.filter(
    (order) => new Date(order.date).getTime() >= oneHourAgo
  );
  return recentOrders.length;
}

export function calculateMetaScore(item: Item, position: string): number {
  const weights =
    META_WEIGHTS[position as keyof typeof META_WEIGHTS];
  if (!weights) return 0;

  let score = 0;

  for (const [attr, weight] of Object.entries(weights)) {
    const value = item[attr as keyof Item];
    if (typeof value === 'number') {
      score += value * (weight as number);
    }
  }

  // Bonus for elite quirks
  const quirks = item.quirks || [];
  const eliteQuirkCount = quirks.filter((q) =>
    ELITE_QUIRKS.includes(q)
  ).length;
  score += eliteQuirkCount * 5;

  return Math.round(score * 100) / 100;
}

export function calculateExchangePoints(
  ovr: number,
  rarity: string
): number {
  const rarityMultiplier: Record<string, number> = {
    'Red Diamond': 6.0,
    Diamond: 5.0,
    Gold: 3.0,
    Silver: 2.0,
    Bronze: 1.5,
    Common: 1.0,
  };

  const multiplier = rarityMultiplier[rarity] ?? 1.0;
  return Math.round(ovr * ovr * multiplier * 0.1);
}
