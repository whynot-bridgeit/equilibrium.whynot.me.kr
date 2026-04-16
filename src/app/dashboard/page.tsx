'use client';
import { useRefreshData } from '@/hooks/useRefreshData';
import { MetricCard } from '@/components/MetricCard';
import { RefreshControl } from '@/components/RefreshControl';
import { AlertBanner } from '@/components/AlertBanner';
import { FollowerTrendChart } from '@/components/TrendChart';
import { formatNumber, formatPct, platformLabel, platformColor } from '@/lib/utils';
import type { OverviewStats, PlatformMetrics } from '@/types';
import { MEMBERS } from '@/data/members';
import { MEMBER_ANALYTICS } from '@/data/mockSocialData';

interface OverviewResponse extends OverviewStats {
  lastUpdated: string;
  platforms: PlatformMetrics[];
}

const platformIcons: Record<string, string> = {
  instagram: '📸',
  youtube: '▶️',
  tiktok: '🎵',
  twitter: '𝕏',
  discord: '💬',
};

export default function OverviewPage() {
  const { data, loading, lastUpdated, refresh } =
    useRefreshData<OverviewResponse>('/api/overview', 60_000);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            MEP-C 소셜 미디어 대시보드
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            GBK Entertainment · 5개국 7인조 글로벌 걸그룹
          </p>
        </div>
        <RefreshControl
          onRefresh={refresh}
          loading={loading}
          lastUpdated={lastUpdated}
          autoRefreshSecs={60}
        />
      </div>

      {/* KPI Row */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="총 팔로워 (전채널)"
            value={data.totalFollowers}
            change={data.totalFollowersChange7d}
            changePct={data.totalFollowersChangePct7d}
            accent="#e91e8c"
          />
          <MetricCard
            label="평균 인게이지먼트율"
            value={`${data.avgEngagementRate.toFixed(2)}%`}
            changePct={data.avgEngagementRateChange7d}
            accent="#7c3aed"
          />
          <MetricCard
            label="예상 총 도달"
            value={data.totalReach}
            accent="#06b6d4"
          />
          <MetricCard
            label="활성 알림"
            value={data.activeAlerts}
            accent="#f59e0b"
            sub="요주의 채널 신호"
          />
        </div>
      )}

      {/* Platform Cards */}
      {data?.platforms && (
        <div>
          <h2 className="text-base font-semibold text-white mb-3">
            플랫폼별 공식 계정 (@mepc_official)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.platforms.map((p) => (
              <div
                key={p.platform}
                className="bg-[#111118] border border-[#242434] rounded-xl p-4 flex flex-col gap-2"
                style={{ borderTopColor: platformColor(p.platform), borderTopWidth: 3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    {platformIcons[p.platform]} {platformLabel(p.platform)}
                  </span>
                  <span className="text-xs text-slate-500">@{p.handle}</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatNumber(p.followers)}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={
                      p.followersChangePct7d >= 0 ? 'text-green-400' : 'text-red-400'
                    }
                  >
                    {p.followersChangePct7d >= 0 ? '▲' : '▼'}{' '}
                    {formatPct(p.followersChangePct7d)}
                  </span>
                  <span className="text-slate-500">7d</span>
                </div>
                <div className="text-xs text-slate-400">
                  ER {p.engagementRate.toFixed(2)}%
                </div>
                <div className="h-16 mt-1">
                  <FollowerTrendChart
                    data={p.trendData}
                    color={platformColor(p.platform)}
                    height={64}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Grid */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">멤버별 인스타그램</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {MEMBER_ANALYTICS.map((ma) => {
            const ig = ma.platforms[0];
            const member = MEMBERS.find((m) => m.id === ma.member.id)!;
            return (
              <div
                key={ma.member.id}
                className="bg-[#111118] border border-[#242434] rounded-xl p-3 flex flex-col gap-2"
                style={{ borderTopColor: member.color, borderTopWidth: 3 }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{member.flag}</span>
                  <span className="text-xs font-bold text-white">{member.stageName}</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {formatNumber(ig.followers)}
                </div>
                <div
                  className={`text-xs ${ig.followersChangePct7d >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {ig.followersChangePct7d >= 0 ? '▲' : '▼'}{' '}
                  {formatPct(ig.followersChangePct7d)}
                </div>
                <div className="text-xs text-slate-500">ER {ig.engagementRate.toFixed(1)}%</div>
                <div className="h-12">
                  <FollowerTrendChart
                    data={ig.trendData}
                    color={member.color}
                    height={48}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">최근 알림 & 오딧</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data?.platforms
            .flatMap((p) => p.alerts ?? [])
            .slice(0, 6)
            .map((alert) => (
              <AlertBanner key={alert.id} alert={alert} />
            ))}
        </div>
      </div>
    </div>
  );
}
