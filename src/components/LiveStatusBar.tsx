'use client';
import { useSSE } from '@/hooks/useSSE';
import { formatNumber, formatPct } from '@/lib/utils';

interface StreamSnapshot {
  type: string;
  timestamp: string;
  overview: {
    totalFollowers: number;
    avgEngagementRate: number;
    activeAlerts: number;
  };
  platforms: {
    platform: string;
    handle: string;
    followers: number;
    engagementRate: number;
    followersChangePct7d: number;
  }[];
  alerts: { id: string; severity: string; title: string; timestamp: string }[];
}

const platformIcons: Record<string, string> = {
  instagram: 'IG',
  youtube: 'YT',
  tiktok: 'TK',
  twitter: 'X',
  discord: 'DC',
};

const platformColors: Record<string, string> = {
  instagram: '#e1306c',
  youtube: '#ff0000',
  tiktok: '#69c9d0',
  twitter: '#1da1f2',
  discord: '#5865f2',
};

export function LiveStatusBar() {
  const { data, status } = useSSE<StreamSnapshot>('/api/stream');

  return (
    <div className="bg-[#0d0d14] border-b border-[#242434] px-4 py-2 flex items-center gap-4 overflow-x-auto text-xs">
      {/* Live indicator */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className={`w-2 h-2 rounded-full ${
            status === 'open' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
          }`}
        />
        <span className={status === 'open' ? 'text-green-400' : 'text-yellow-400'}>
          {status === 'open' ? 'LIVE' : status === 'connecting' ? 'CONNECTING…' : 'RECONNECTING'}
        </span>
      </div>

      <span className="text-[#242434] select-none">|</span>

      {/* Last update */}
      {data && (
        <span className="text-slate-500 shrink-0">
          {new Date(data.timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      )}

      {/* Platform tickers */}
      {data?.platforms.map((p) => (
        <div key={p.platform} className="flex items-center gap-1.5 shrink-0">
          <span
            className="px-1 rounded text-white font-bold"
            style={{ background: platformColors[p.platform] ?? '#888', fontSize: 10 }}
          >
            {platformIcons[p.platform] ?? p.platform}
          </span>
          <span className="text-white font-medium">{formatNumber(p.followers)}</span>
          <span
            className={p.followersChangePct7d >= 0 ? 'text-green-400' : 'text-red-400'}
          >
            {formatPct(p.followersChangePct7d)}
          </span>
        </div>
      ))}

      {/* Global ER */}
      {data && (
        <>
          <span className="text-[#242434] select-none">|</span>
          <span className="text-slate-400 shrink-0">
            ER avg{' '}
            <span className="text-white font-medium">
              {data.overview.avgEngagementRate.toFixed(2)}%
            </span>
          </span>
        </>
      )}

      {/* Latest alert */}
      {data?.alerts?.[0] && (
        <>
          <span className="text-[#242434] select-none">|</span>
          <span className="text-yellow-300 shrink-0 truncate max-w-xs">
            🔔 {data.alerts[0].title}
          </span>
        </>
      )}
    </div>
  );
}
