'use client';

import Link from 'next/link';
import { TrendingUp, Users, Wrench, FolderCheck, ArrowLeftRight, BarChart3, Target, Star, Package, Trophy, Map, Wallet, RefreshCw } from 'lucide-react';

const features = [
  { href: '/flipping', icon: TrendingUp, title: 'Market Flipping', desc: 'Find the best flips with live buy/sell data', color: 'text-profit' },
  { href: '/players', icon: Users, title: 'Player Database', desc: 'Browse all cards with meta overall and stats', color: 'text-info' },
  { href: '/my-team', icon: Wrench, title: 'My Team Builder', desc: 'Build your squad for personalized recommendations', color: 'text-accent-primary' },
  { href: '/collections', icon: FolderCheck, title: 'Collections', desc: 'Live Series & Program collections with rewards', color: 'text-warning' },
  { href: '/exchanges', icon: ArrowLeftRight, title: 'Exchange Calculator', desc: 'Find cheapest cards per exchange point', color: 'text-rarity-bronze' },
  { href: '/movers', icon: BarChart3, title: 'Market Movers', desc: 'Top gainers, losers, and market indices', color: 'text-rarity-diamond' },
  { href: '/programs', icon: Target, title: 'Program Advisor', desc: 'Programs & modes ranked with card rewards', color: 'text-loss' },
  { href: '/watchlist', icon: Star, title: 'Flip Watchlist', desc: 'Track cards you want to flip', color: 'text-warning' },
  { href: '/packs', icon: Package, title: 'Pack Value', desc: 'EV calculator for all shop packs', color: 'text-rarity-gold' },
  { href: '/tier-list', icon: Trophy, title: 'Meta Tier List', desc: 'Position-weighted rankings with quirk bonuses', color: 'text-accent-primary' },
  { href: '/conquest', icon: Map, title: 'Conquest Tracker', desc: 'Checklist for every hidden reward', color: 'text-profit' },
  { href: '/budget', icon: Wallet, title: 'Budget Planner', desc: 'Smart spend plan for your stub count', color: 'text-rarity-gold' },
  { href: '/roster-updates', icon: RefreshCw, title: 'Roster Predictor', desc: 'Investment opportunities from upgrade patterns', color: 'text-info' },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-text-primary mb-3">
          Stub <span className="text-accent-primary">Zone</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Your Diamond Dynasty companion for MLB The Show 26. Live market data, team building, collection tracking, and more.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Top Flip Profit', value: '—', sub: 'Load Flipping page' },
          { label: 'Market Trend', value: '—', sub: 'Check Movers' },
          { label: 'Your Team OVR', value: '—', sub: 'Build your team' },
        ].map((s) => (
          <div key={s.label} className="bg-bg-secondary border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">{s.label}</div>
            <div className="font-mono text-2xl font-bold text-text-primary">{s.value}</div>
            <div className="text-text-tertiary text-xs mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group bg-bg-secondary border border-border-subtle rounded-xl p-5 hover:border-[rgba(6,214,160,0.3)] hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-black/10"
          >
            <f.icon size={24} className={`${f.color} mb-3`} />
            <h3 className="font-heading font-semibold text-text-primary mb-1 group-hover:text-accent-primary transition-colors">{f.title}</h3>
            <p className="text-text-secondary text-sm">{f.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
