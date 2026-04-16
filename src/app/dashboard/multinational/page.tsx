'use client';
import { useRefreshData } from '@/hooks/useRefreshData';
import { RefreshControl } from '@/components/RefreshControl';
import { formatNumber } from '@/lib/utils';
import type { KpopGroup } from '@/types';
import { MULTINATIONAL_GROUPS } from '@/data/kpopGroups';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
} from 'recharts';

interface MarketData {
  groups: KpopGroup[];
  lastUpdated: string;
}

const RADAR_METRICS = [
  { label: 'IG 팔로워', key: 'totalInstagramFollowers', max: 100000000 },
  { label: 'YT 구독자', key: 'totalYoutubeSubscribers', max: 92000000 },
  { label: 'TK 팔로워', key: 'totalTiktokFollowers', max: 65000000 },
  { label: 'ER', key: 'engagementRate', max: 8 },
  { label: '주간성장', key: 'weeklyGrowthPct', max: 3 },
  { label: '해외멤버', key: 'foreignMemberCount', max: 7 },
];

const COLORS = ['#e91e8c', '#7c3aed', '#06b6d4', '#f59e0b', '#22c55e', '#f87171'];

const NATIONALITY_FLAGS: Record<string, string> = {
  KR: '🇰🇷', IN: '🇮🇳', NP: '🇳🇵', TN: '🇹🇳', MM: '🇲🇲',
};

export default function MultinationalPage() {
  const { data, loading, lastUpdated, refresh } =
    useRefreshData<MarketData>('/api/kpop-market', 120_000);

  const multinatGroups = (data?.groups ?? MULTINATIONAL_GROUPS).filter(
    (g) => g.foreignMemberCount > 0
  );

  const radarData = RADAR_METRICS.map((metric) => {
    const row: Record<string, number | string> = { metric: metric.label };
    multinatGroups.forEach((g) => {
      const raw = g[metric.key as keyof KpopGroup] as number;
      row[g.name] = Math.round((raw / metric.max) * 100);
    });
    return row;
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">다국적 K-POP 그룹 모니터링</h1>
          <p className="text-slate-400 text-sm mt-1">
            해외 국적 멤버가 포함된 걸그룹 — MEP-C 포지셔닝 비교
          </p>
        </div>
        <RefreshControl onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} autoRefreshSecs={120} />
      </div>

      {/* Radar Chart */}
      <div className="bg-[#111118] border border-[#242434] rounded-xl p-5">
        <div className="text-sm font-semibold text-white mb-4">
          다국적 그룹 종합 역량 비교 (정규화 점수 0–100)
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#242434" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ background: '#1a1a24', border: '1px solid #242434', borderRadius: 8, fontSize: 11 }}
            />
            {multinatGroups.map((g, i) => (
              <Radar
                key={g.name}
                name={g.name}
                dataKey={g.name}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={g.name === 'MEP-C' ? 0.25 : 0.06}
                strokeWidth={g.name === 'MEP-C' ? 2.5 : 1.5}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {multinatGroups.map((g, i) => (
            <span key={g.name} className="flex items-center gap-1.5 text-xs text-slate-300">
              <span
                className="w-3 h-0.5 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              {g.name === 'MEP-C' ? <strong className="text-[#e91e8c]">MEP-C</strong> : g.name}
            </span>
          ))}
        </div>
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {multinatGroups.map((g, i) => (
          <div
            key={g.name}
            className={`bg-[#111118] border rounded-xl p-5 flex flex-col gap-3 ${
              g.name === 'MEP-C'
                ? 'border-[#e91e8c]/50 bg-[#e91e8c]/5'
                : 'border-[#242434]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-base font-bold"
                  style={{ color: COLORS[i % COLORS.length] }}
                >
                  {g.name}
                  {g.name === 'MEP-C' && ' ★'}
                </div>
                <div className="text-xs text-slate-500">{g.agency} · {g.debutYear}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">ER</div>
                <div
                  className="text-lg font-bold"
                  style={{
                    color:
                      g.engagementRate >= 5
                        ? '#22c55e'
                        : g.engagementRate >= 3.5
                        ? '#fbbf24'
                        : '#ef4444',
                  }}
                >
                  {g.engagementRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Nationalities */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">멤버 국적:</span>
              <span className="text-xs text-slate-300">
                🇰🇷 × {g.memberCount - g.foreignMemberCount}
              </span>
              {g.foreignNationalities.map((n) => (
                <span key={n} className="text-xs text-slate-300">
                  {NATIONALITY_FLAGS[n] ?? n} × 1
                </span>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Instagram', value: g.totalInstagramFollowers },
                { label: 'YouTube', value: g.totalYoutubeSubscribers },
                { label: 'TikTok', value: g.totalTiktokFollowers },
              ].map((m) => (
                <div key={m.label} className="bg-[#1a1a24] rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-500 mb-0.5">{m.label}</div>
                  <div className="text-sm font-bold text-white">{formatNumber(m.value)}</div>
                </div>
              ))}
            </div>

            {/* Weekly Growth */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">주간 성장률</span>
              <span
                className="font-bold"
                style={{ color: g.weeklyGrowthPct > 0 ? '#22c55e' : '#ef4444' }}
              >
                {g.weeklyGrowthPct > 0 ? '▲' : '▼'} {Math.abs(g.weeklyGrowthPct).toFixed(2)}%
              </span>
            </div>

            {/* Notes */}
            <div className="text-xs text-slate-500 border-t border-[#242434] pt-2">
              {g.notes}
            </div>
          </div>
        ))}
      </div>

      {/* Insight Box */}
      <div className="bg-[#111118] border border-[#7c3aed]/30 rounded-xl p-5">
        <div className="text-sm font-semibold text-[#a78bfa] mb-2">
          MEP-C 포지셔닝 인사이트
        </div>
        <ul className="text-sm text-slate-300 flex flex-col gap-2">
          <li>• MEP-C는 다국적 그룹 중 <strong className="text-white">주간 성장률 1위</strong> (2.18%/주). 이 모멘텀을 유지하기 위해 각 국가별 타겟 콘텐츠를 지속 강화해야 합니다.</li>
          <li>• TWICE 대비 ER이 높아 <strong className="text-white">팬 충성도 레버리지</strong>가 훨씬 강함. 커뮤니티 기반 콘텐츠(Q&A, 팬 투표)로 ER을 더 높일 수 있습니다.</li>
          <li>• NewJeans와 유사한 TikTok 성장 곡선 — <strong className="text-white">숏폼 알고리즘 최적화</strong>가 차세대 성장 동력.</li>
          <li>• 5개국 출신 구성은 경쟁 그룹이 갖지 못한 <strong className="text-white">유일한 내러티브 자산</strong>. 각 국가 미디어의 관심을 동시 공략하세요.</li>
        </ul>
      </div>
    </div>
  );
}
