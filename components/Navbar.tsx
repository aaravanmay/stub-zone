'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Users,
  Wrench,
  FolderCheck,
  ArrowLeftRight,
  BarChart3,
  Target,
  Star,
  Package,
  Trophy,
  Map,
  Wallet,
  RefreshCw,
  MoreHorizontal,
  X,
  ShoppingCart,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Flipping', href: '/flipping', icon: TrendingUp },
  { label: 'Players', href: '/players', icon: Users },
  { label: 'My Team', href: '/my-team', icon: Wrench },
  { label: 'Collections', href: '/collections', icon: FolderCheck },
  { label: 'Exchanges', href: '/exchanges', icon: ArrowLeftRight },
  { label: 'Movers', href: '/movers', icon: BarChart3 },
  { label: 'Programs', href: '/programs', icon: Target },
  { label: 'Watchlist', href: '/watchlist', icon: Star },
  { label: 'Packs', href: '/packs', icon: Package },
  { label: 'Tier List', href: '/tier-list', icon: Trophy },
  { label: 'Conquest', href: '/conquest', icon: Map },
  { label: 'Budget', href: '/budget', icon: Wallet },
  { label: 'Roster Updates', href: '/roster-updates', icon: RefreshCw },
];

const MOBILE_TABS: NavItem[] = [
  { label: 'Flipping', href: '/flipping', icon: TrendingUp },
  { label: 'Players', href: '/players', icon: Users },
  { label: 'My Team', href: '/my-team', icon: Wrench },
  { label: 'Market', href: '/movers', icon: ShoppingCart },
];

export default function Navbar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close More sheet on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Close More sheet on outside click
  useEffect(() => {
    if (!moreOpen) return;
    function handleClick(e: MouseEvent) {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [moreOpen]);

  // Close More sheet on Escape key
  useEffect(() => {
    if (!moreOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMoreOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [moreOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ─── Desktop sidebar (icon rail, expands on hover) ─── */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full z-40 group">
        <nav className="flex flex-col h-full w-16 group-hover:w-56 transition-all duration-300 ease-in-out bg-bg-secondary/80 backdrop-blur-sm border-r border-border-subtle overflow-hidden">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 h-16 shrink-0 border-b border-border-subtle"
          >
            <span className="text-xl leading-none shrink-0" role="img" aria-label="baseball">
              &#9918;
            </span>
            <span className="font-heading font-bold text-accent-primary text-sm tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              STUB ZONE
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-dark">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex items-center gap-3 px-[18px] py-2.5 mx-1 rounded-lg
                    transition-colors duration-200 whitespace-nowrap
                    ${
                      active
                        ? 'text-accent-primary bg-accent-muted'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent-primary" />
                  )}
                  <Icon size={20} className="shrink-0" />
                  <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* ─── Mobile top bar ─── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-center bg-bg-secondary/80 backdrop-blur-sm border-b border-border-subtle">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label="baseball">
            &#9918;
          </span>
          <span className="font-heading font-bold text-accent-primary text-sm tracking-wide">
            STUB ZONE
          </span>
        </Link>
      </header>

      {/* ─── Mobile bottom tab bar ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary/95 backdrop-blur-sm border-t border-border-subtle">
        <div className="flex items-center justify-around h-16 px-1">
          {MOBILE_TABS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5
                  transition-colors duration-200
                  ${active ? 'text-accent-primary' : 'text-text-tertiary'}
                `}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium leading-tight">
                  {item.label}
                </span>
                {active && (
                  <span className="w-1 h-1 rounded-full bg-accent-primary mt-0.5" />
                )}
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={`
              flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5
              transition-colors duration-200
              ${moreOpen ? 'text-accent-primary' : 'text-text-tertiary'}
            `}
            aria-label="More navigation options"
          >
            <MoreHorizontal size={20} />
            <span className="text-[10px] font-medium leading-tight">More</span>
          </button>
        </div>
      </nav>

      {/* ─── Mobile "More" slide-up sheet ─── */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200">
          <div
            ref={sheetRef}
            className="absolute bottom-0 left-0 right-0 bg-bg-secondary rounded-t-2xl border-t border-border-subtle max-h-[75vh] overflow-y-auto animate-slide-up"
            style={{
              animation: 'slideUp 0.25s ease-out',
            }}
          >
            {/* Handle + close */}
            <div className="sticky top-0 bg-bg-secondary rounded-t-2xl pt-3 pb-2 px-5 flex items-center justify-between border-b border-border-subtle">
              <span className="text-sm font-heading font-semibold text-text-primary">
                Navigation
              </span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>

            {/* All nav items */}
            <div className="grid grid-cols-3 gap-1 p-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-xl
                      transition-colors duration-200
                      ${
                        active
                          ? 'text-accent-primary bg-accent-muted'
                          : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                      }
                    `}
                  >
                    <Icon size={22} />
                    <span className="text-[11px] font-medium text-center leading-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Keyframe for slide-up animation */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
