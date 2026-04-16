'use client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { DayData } from '@/types';
import { formatNumber } from '@/lib/utils';

interface TrendChartProps {
  data: DayData[];
  metric?: 'followers' | 'engagementRate';
  color?: string;
  height?: number;
  showGrid?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a24] border border-[#242434] rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-slate-400 mb-1">{label}</div>
      {payload.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entry: any) => (
          <div key={entry.name} style={{ color: entry.color }} className="font-medium">
            {entry.name === 'followers'
              ? formatNumber(entry.value)
              : `${entry.value.toFixed(2)}%`}
          </div>
        )
      )}
    </div>
  );
}

export function FollowerTrendChart({
  data,
  color = '#e91e8c',
  height = 180,
  showGrid = false,
}: TrendChartProps) {
  const sliced = data.slice(-30);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={sliced} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#242434" />
        )}
        <XAxis
          dataKey="date"
          tickFormatter={(v: string) => v.slice(5)}
          tick={{ fontSize: 10, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v: number) => formatNumber(v)}
          tick={{ fontSize: 10, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="followers"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${color.slice(1)})`}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function EngagementRateChart({
  data,
  color = '#7c3aed',
  height = 180,
}: TrendChartProps) {
  const sliced = data.slice(-30);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={sliced} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
        <XAxis
          dataKey="date"
          tickFormatter={(v: string) => v.slice(5)}
          tick={{ fontSize: 10, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v: number) => `${v.toFixed(1)}%`}
          tick={{ fontSize: 10, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="engagementRate"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
