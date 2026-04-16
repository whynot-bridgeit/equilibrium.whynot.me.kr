'use client';
import { useState } from 'react';
import { useRefreshData } from '@/hooks/useRefreshData';
import { RefreshControl } from '@/components/RefreshControl';
import { MetricCard } from '@/components/MetricCard';
import { AlertBanner } from '@/components/AlertBanner';
import { DemographicsPanel } from '@/components/DemographicsPanel';
import { FollowerTrendChart, EngagementRateChart } from '@/components/TrendChart';
import { formatNumber, formatPct, platformLabel, platformColor, sentimentColor } from '@/lib/utils';
import { MEMBERS } from '@/data/members';
import type { MemberAnalytics } from '@/types';

const TABS = ['📸 Instagram', '▶️ YouTube', '🎵 TikTok', '𝕏 Twitter'] as const;
type Tab = typeof TABS[number];

const TAB_PLATFORM: Record<Tab, string> = {
  '📸 Instagram': 'instagram',
  '▶️ YouTube': 'youtube',
  '🎵 TikTok': 'tiktok',
  '𝕏 Twitter': 'twitter',
};

export default function MepcPage() {
  const [selectedMember, setSelectedMember] = useState<string>('official');
  const [activeTab, setActiveTab] = useState<Tab>('📸 Instagram');

  const { data, loading, lastUpdated, refresh } =
    useRefreshData<MemberAnalytics[]>('/api/members', 60_000);

  const memberData = selectedMember === 'official' ? null : data?.find(
    (d) => d.member.id === selectedMember
  );

  const currentPlatform = memberData?.platforms.find(
    (p) => p.platform === TAB_PLATFORM[activeTab]
  ) ?? memberData?.platforms[0];

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">채널별 상세 모니터링</h1>
          <p className="text-slate-400 text-sm mt-1">팔로워 프로파일 · 인게이지먼트 오딧 · 증감 분석</p>
        </div>
        <RefreshControl onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />
      </div>

      {/* Member Selector */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedMember('official')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            selectedMember === 'official'
              ? 'bg-[#e91e8c] text-white'
              : 'bg-[#1a1a24] text-slate-300 hover:text-white'
          }`}
        >
          🏢 Official
        </button>
        {MEMBERS.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMember(m.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedMember === m.id
                ? 'text-white'
                : 'bg-[#1a1a24] text-slate-300 hover:text-white'
            }`}
            style={selectedMember === m.id ? { background: m.color } : {}}
          >
            {m.flag} {m.stageName}
          </button>
        ))}
      </div>

      {/* Official Account View */}
      {selectedMember === 'official' && (
        <div className="bg-[#111118] border border-[#242434] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">@mepc_official — 전체 채널 요약</h2>
          <p className="text-slate-400 text-sm mb-4">
            왼쪽 사이드바 Overview 탭에서 공식 채널 전체 분석을 확인하세요.
            멤버 개인 계정 분석은 위에서 멤버를 선택하세요.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Instagram', handle: '@mepc_official', followers: 423456, growth: 2.1, er: 5.2 },
              { label: 'YouTube', handle: '@mepc_official', followers: 312445, growth: 3.4, er: 4.8 },
              { label: 'TikTok', handle: '@mepc_official', followers: 892113, growth: 4.7, er: 7.1 },
              { label: 'X (Twitter)', handle: '@mepc_official', followers: 187234, growth: 1.3, er: 2.9 },
            ].map((acc) => (
              <div key={acc.label} className="bg-[#1a1a24] rounded-lg p-4">
                <div className="text-sm font-medium text-white mb-1">{acc.label}</div>
                <div className="text-xs text-slate-500 mb-2">{acc.handle}</div>
                <div className="text-xl font-bold text-white">{formatNumber(acc.followers)}</div>
                <div className="text-xs text-green-400 mt-1">▲ {formatPct(acc.growth)} 7d</div>
                <div className="text-xs text-slate-400 mt-0.5">ER {acc.er}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Detail */}
      {memberData && currentPlatform && (
        <>
          {/* Member Profile Header */}
          <div
            className="border rounded-xl p-5 flex items-center gap-4"
            style={{
              borderColor: memberData.member.color + '40',
              background: memberData.member.color + '10',
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-3xl font-black"
              style={{ background: memberData.member.color + '30', color: memberData.member.color }}
            >
              {memberData.member.flag}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-bold text-white">{memberData.member.stageName}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#242434] text-slate-300">
                  {memberData.member.countryName}
                </span>
                {memberData.member.role.map((r) => (
                  <span
                    key={r}
                    className="text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ background: memberData.member.color + '50' }}
                  >
                    {r}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-400 mt-1">{memberData.member.bio}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-slate-500 mb-1">콘텐츠 점수</div>
              <div className="text-2xl font-black" style={{ color: memberData.member.color }}>
                {memberData.contentScore}
              </div>
              <div className="text-xs text-slate-500 mt-1">팬 선호도</div>
              <div className="text-lg font-bold text-white">{memberData.fanFavoriteScore}</div>
            </div>
          </div>

          {/* Platform Tabs — only Instagram available per member */}
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#e91e8c] text-white"
            >
              📸 Instagram
            </button>
            <span className="text-xs text-slate-600 self-center">
              개인 계정은 Instagram만 운영 중
            </span>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="팔로워"
              value={currentPlatform.followers}
              change={currentPlatform.followersChange7d}
              changePct={currentPlatform.followersChangePct7d}
              accent={memberData.member.color}
            />
            <MetricCard
              label="인게이지먼트율"
              value={`${currentPlatform.engagementRate.toFixed(2)}%`}
              changePct={currentPlatform.engagementRateChange7d}
              accent="#7c3aed"
            />
            <MetricCard
              label="평균 좋아요"
              value={currentPlatform.avgLikes}
              accent="#06b6d4"
            />
            <MetricCard
              label="예상 도달"
              value={currentPlatform.reachEstimate}
              accent="#f59e0b"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111118] border border-[#242434] rounded-xl p-4">
              <div className="text-sm font-medium text-white mb-3">팔로워 추세 (30일)</div>
              <FollowerTrendChart
                data={currentPlatform.trendData}
                color={memberData.member.color}
                height={200}
                showGrid
              />
            </div>
            <div className="bg-[#111118] border border-[#242434] rounded-xl p-4">
              <div className="text-sm font-medium text-white mb-3">인게이지먼트율 추세 (30일)</div>
              <EngagementRateChart
                data={currentPlatform.trendData}
                color="#7c3aed"
                height={200}
              />
            </div>
          </div>

          {/* Demographics */}
          <div>
            <h2 className="text-base font-semibold text-white mb-3">팔로워 인구통계</h2>
            <DemographicsPanel demo={currentPlatform.demographics} />
          </div>

          {/* Keywords & Comments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111118] border border-[#242434] rounded-xl p-4">
              <div className="text-sm font-medium text-white mb-3">상위 키워드 & 해시태그</div>
              <div className="flex flex-col gap-2">
                {currentPlatform.topKeywords.map((kw) => (
                  <div key={kw.keyword} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: sentimentColor(kw.sentiment) }}
                      />
                      <span className="text-slate-200 font-medium">{kw.keyword}</span>
                      <span className="text-xs">
                        {kw.trend === 'up' ? '↑' : kw.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                    <span className="text-slate-400 text-xs">{formatNumber(kw.count)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111118] border border-[#242434] rounded-xl p-4">
              <div className="text-sm font-medium text-white mb-3">주요 댓글 분석</div>
              <div className="flex flex-col gap-2">
                {currentPlatform.topComments.map((c, i) => (
                  <div key={i} className="bg-[#1a1a24] rounded-lg p-2.5 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-1.5 py-0.5 rounded text-white font-bold"
                        style={{ background: sentimentColor(c.sentiment) + 'aa' }}
                      >
                        {c.sentiment}
                      </span>
                      <span className="text-slate-500">{c.language}</span>
                      <span className="ml-auto text-slate-400">♥ {formatNumber(c.likes)}</span>
                    </div>
                    <div className="text-slate-300">{c.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div>
            <h2 className="text-base font-semibold text-white mb-3">증감 분석 & 오딧 알림</h2>
            <div className="flex flex-col gap-3">
              {currentPlatform.alerts.map((alert) => (
                <AlertBanner key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
