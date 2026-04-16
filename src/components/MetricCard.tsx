'use client';
import { cn, formatNumber, formatPct } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changePct?: number;
  sub?: string;
  icon?: React.ReactNode;
  accent?: string;
  compact?: boolean;
}

export function MetricCard({
  label,
  value,
  change,
  changePct,
  sub,
  icon,
  accent = '#e91e8c',
  compact = false,
}: MetricCardProps) {
  const isUp = (change ?? changePct ?? 0) >= 0;
  const hasChange = change !== undefined || changePct !== undefined;

  return (
    <div
      className={cn(
        'bg-[#111118] border border-[#242434] rounded-xl flex flex-col gap-1',
        compact ? 'p-3' : 'p-4'
      )}
      style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
          {label}
        </span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>

      <div className={cn('font-bold text-white', compact ? 'text-xl' : 'text-2xl')}>
        {typeof value === 'number' ? formatNumber(value) : value}
      </div>

      {hasChange && (
        <div className="flex items-center gap-2 text-xs">
          {change !== undefined && (
            <span className={isUp ? 'text-green-400' : 'text-red-400'}>
              {isUp ? '▲' : '▼'} {formatNumber(Math.abs(change))}
            </span>
          )}
          {changePct !== undefined && (
            <span className={isUp ? 'text-green-400' : 'text-red-400'}>
              ({formatPct(changePct)})
            </span>
          )}
          <span className="text-slate-500">7d</span>
        </div>
      )}

      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}
