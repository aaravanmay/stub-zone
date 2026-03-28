import { RARITY_COLORS } from '@/lib/constants';

interface RarityBadgeProps {
  rarity: string;
  className?: string;
}

export default function RarityBadge({ rarity, className = '' }: RarityBadgeProps) {
  const colors = RARITY_COLORS[rarity] ?? RARITY_COLORS['Common'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: colors.dot }}
      />
      {rarity}
    </span>
  );
}
