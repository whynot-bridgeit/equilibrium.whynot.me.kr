'use client';
import { useRefreshData } from '@/hooks/useRefreshData';
import { RefreshControl } from '@/components/RefreshControl';
import { MetricCard } from '@/components/MetricCard';
import { formatNumber, formatPct } from '@/lib/utils';
import type { KpopGroup } from '@/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

interface MarketData {
  groups: KpopGroup[];
  marketStats: {
    totalGroupsTracked: number;
    avgFollowerGrowthWeekly: number;
    avgEngagementRate: number;
    topPlatformByGrowth: string;
    emergingMarkets: string[];
    topHashtags: { tag: string; volume: number }[];
  };
  lastUpdated: string;
}

export default function KpopMarketPage() {
  const { data, loading, lastUpdated, refresh } =
    useRefreshData<MarketData>('/api/kpop-market', 120_000);

  const mepc = data?.groups.find((g) => g.name === 'MEP-C');
  const peers = data?.groups.filter((g) => g.name !== 'MEP-C') ?? [];

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">K-POP 시장 전체 모니터링</h1>
          <p className="text-slate-400 text-sm mt-1">
            주요 걸그룹 팔로워 · 인게이지먼트 · 성장률 비교
          </p>
        </div>
        <RefreshControl onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} autoRefreshSecs={120} />
      </div>

      {/* Market KPIs */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="트래킹 그룹 수"
            value={data.marketStats.totalGroupsTracked}
            accent="#e91e8c"
          />
          <MetricCard
            label="시장 평균 주간 성장"
            value={`${data.marketStats.avgFollowerGrowthWeekly.toFixed(2)}%`}
            accent="#7c3aed"
            sub={`MEP-C: ${mepc ? formatPct(mepc.weeklyGrowthPct) : '—'}`}
          />
          <MetricCard
            label="시장 평균 ER"
            value={`${data.marketStats.avgEngagementRate.toFixed(1)}%`}
            accent="#06b6d4"
            sub={`MEP-C: ${mepc ? `${mepc.engagementRate.toFixed(1)}%` : '—'}`}
          />
          <MetricCard
            label="최고 성장 플랫폼"
            value={data.marketStats.topPlatformByGrowth.toUpperCase()}
            accent="#f59e0b"
            sub="TikTok 주도"
          />
        </div>
      )}

      {/* MEP-C vs Market */}
      {mepc && (
        <div className="bg-[#111118] border border-[#e91e8c]/30 rounded-xl p-5">
          <div className="text-sm font-semibold text-[#e91e8c] mb-1">MEP-C vs 시장 평균</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
            {[
              { label: '주간 성장', mepc: mepc.weeklyGrowthPct, market: data!.marketStats.avgFollowerGrowthWeekly, unit: '%' },
              { label: '인게이지먼트', mepc: mepc.engagementRate, market: data!.marketStats.avgEngagementRate, unit: '%' },
              { label: 'Instagram', mepc: mepc.totalInstagramFollowers, market: peers.reduce((s, g) => s + g.totalInstagramFollowers, 0) / peers.length, unit: '' },
              { label: 'YouTube', mepc: mepc.totalYoutubeSubscribers, market: peers.reduce((s, g) => s + g.totalYoutubeSubscribers, 0) / peers.length, unit: '' },
              { label: 'TikTok', mepc: mepc.totalTiktokFollowers, market: peers.reduce((s, g) => s + g.totalTiktokFollowers, 0) / peers.length, unit: '' },
              { label: '해외멤버', mepc: mepc.foreignMemberCount, market: peers.reduce((s, g) => s + g.foreignMemberCount, 0) / peers.length, unit: '' },
            ].map((item) => (
              <div key={item.label} className="bg-[#1a1a24] rounded-lg p-3 text-center">
                <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                <div className="text-base font-bold text-[#e91e8c]">
                  {item.unit === '%' ? `${item.mepc.toFixed(1)}%` : formatNumber(Math.round(item.mepc))}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  시장 avg: {item.unit === '%' ? `${item.market.toFixed(1)}%` : formatNumber(Math.round(item.market))}
                </div>
                {item.mepc > item.market ? (
                  <div className="text-xs text-green-400 mt-1">▲ 상회</div>
                ) : (
                  <div className="text-xs text-red-400 mt-1">▼ 하회</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instagram Followers Bar Chart */}
      {data && (
        <div className="bg-[#111118] border border-[#242434] rounded-xl p-5">
          <div className="text-sm font-semibold text-white mb-4">Instagram 팔로워 비교</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data.groups.sort((a, b) => b.totalInstagramFollowers - a.totalInstagramFollowers)}
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#242434" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => formatNumber(v)}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                formatter={(v: number) => formatNumber(v)}
                contentStyle={{ background: '#1a1a24', border: '1px solid #242434', borderRadius: 8 }}
              />
              <Bar
                dataKey="totalInstagramFollowers"
                name="IG 팔로워"
                radius={[4, 4, 0, 0]}
                fill="#e91e8c"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weekly Growth vs ER Scatter */}
      {data && (
        <div className="bg-[#111118] border border-[#242434] rounded-xl p-5">
          <div className="text-sm font-semibold text-white mb-1">
            주간 성장률 vs 인게이지먼트율 (버블 = TikTok 팔로워)
          </div>
          <div className="text-xs text-slate-500 mb-4">
            우상단이 최적 포지션 (고성장 + 고ER)
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242434" />
              <XAxis
                dataKey="weeklyGrowthPct"
                name="주간 성장"
                tickFormatter={(v: number) => `${v.toFixed(1)}%`}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                label={{ value: '주간 성장률 %', position: 'insideBottom', offset: -4, fill: '#6b7280', fontSize: 10 }}
              />
              <YAxis
                dataKey="engagementRate"
                name="ER"
                tickFormatter={(v: number) => `${v.toFixed(1)}%`}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <ZAxis dataKey="totalTiktokFollowers" range={[40, 300]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3', stroke: '#242434' }}
                contentStyle={{ background: '#1a1a24', border: '1px solid #242434', borderRadius: 8, fontSize: 11 }}
                formatter={(v: number, name: string) => [
                  name === 'ER' || name === '주간 성장' ? `${v.toFixed(2)}%` : formatNumber(v),
                  name,
                ]}
              />
              <Scatter
                data={data.groups}
                fill="#e91e8c"
                fillOpacity={0.75}
                name="그룹"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Groups Table */}
      {data && (
        <div className="bg-[#111118] border border-[#242434] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#242434] text-sm font-semibold text-white">
            전체 그룹 데이터
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#242434]">
                  {['그룹', '소속사', '데뷔', '멤버', '해외멤버', 'IG', 'YT', 'TK', 'ER', '주간성장'].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {data.groups.map((g) => (
                  <tr
                    key={g.name}
                    className={`border-b border-[#242434]/50 hover:bg-[#1a1a24] transition-colors ${
                      g.name === 'MEP-C' ? 'bg-[#e91e8c]/5' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 font-medium text-white whitespace-nowrap">
                      {g.name === 'MEP-C' ? (
                        <span className="text-[#e91e8c]">{g.name} ★</span>
                      ) : (
                        g.name
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">{g.agency}</td>
                    <td className="px-4 py-2.5 text-slate-400">{g.debutYear}</td>
                    <td className="px-4 py-2.5 text-slate-300">{g.memberCount}</td>
                    <td className="px-4 py-2.5 text-slate-300">{g.foreignMemberCount}</td>
                    <td className="px-4 py-2.5 text-slate-200 whitespace-nowrap">
                      {formatNumber(g.totalInstagramFollowers)}
                    </td>
                    <td className="px-4 py-2.5 text-slate-200 whitespace-nowrap">
                      {formatNumber(g.totalYoutubeSubscribers)}
                    </td>
                    <td className="px-4 py-2.5 text-slate-200 whitespace-nowrap">
                      {formatNumber(g.totalTiktokFollowers)}
                    </td>
                    <td
                      className="px-4 py-2.5 font-medium whitespace-nowrap"
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
                    </td>
                    <td
                      className="px-4 py-2.5 font-medium whitespace-nowrap"
                      style={{ color: g.weeklyGrowthPct > 0 ? '#22c55e' : '#ef4444' }}
                    >
                      {formatPct(g.weeklyGrowthPct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Emerging Markets */}
      {data && (
        <div className="bg-[#111118] border border-[#242434] rounded-xl p-5">
          <div className="text-sm font-semibold text-white mb-3">K-POP 신흥 시장</div>
          <div className="flex flex-wrap gap-2">
            {data.marketStats.emergingMarkets.map((m) => (
              <span
                key={m}
                className="px-3 py-1.5 bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 rounded-full text-sm font-medium"
              >
                {m}
              </span>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-500">
            * MEP-C는 인도, 네팔, 튀니지, 미얀마 멤버로 위 시장들에 직접 접근 가능한 유일한 걸그룹
          </div>
        </div>
      )}
    </div>
  );
}
