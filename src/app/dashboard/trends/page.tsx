'use client';
import { useState } from 'react';
import { useRefreshData } from '@/hooks/useRefreshData';
import { RefreshControl } from '@/components/RefreshControl';
import { PlatformBadge } from '@/components/PlatformBadge';
import type { TrendingContent, Platform } from '@/types';

interface TrendsResponse {
  trends: TrendingContent[];
  lastUpdated: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'existing-fan': '기존 팬 강화',
  'new-fan': '신규 팬 유입',
  both: '기존 + 신규',
};

const CATEGORY_COLORS: Record<string, string> = {
  'existing-fan': '#7c3aed',
  'new-fan': '#06b6d4',
  both: '#e91e8c',
};

const TYPE_ICONS: Record<string, string> = {
  keyword: '🔍',
  meme: '😂',
  challenge: '💪',
  sound: '🎵',
  format: '🎬',
};

export default function TrendsPage() {
  const [filter, setFilter] = useState<'all' | 'existing-fan' | 'new-fan' | 'both'>('all');

  const { data, loading, lastUpdated, refresh } =
    useRefreshData<TrendsResponse>('/api/trends', 120_000);

  const trends = (data?.trends ?? []).filter(
    (t) => filter === 'all' || t.category === filter
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">트렌드 & 콘텐츠 제안</h1>
          <p className="text-slate-400 text-sm mt-1">
            키워드 · 밈 · 챌린지 · 포맷 — 실시간 트렌드 탐지 & 전략 제안
          </p>
        </div>
        <RefreshControl onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} autoRefreshSecs={120} />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'existing-fan', 'new-fan', 'both'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-[#e91e8c] text-white'
                : 'bg-[#1a1a24] text-slate-300 hover:text-white'
            }`}
          >
            {f === 'all'
              ? '전체'
              : CATEGORY_LABELS[f]}
          </button>
        ))}
        <span className="self-center text-xs text-slate-500 ml-2">
          {trends.length}개 트렌드
        </span>
      </div>

      {/* Trend Cards */}
      <div className="flex flex-col gap-4">
        {trends.map((trend, idx) => (
          <div
            key={trend.id}
            className="bg-[#111118] border border-[#242434] rounded-xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl">{TYPE_ICONS[trend.type]}</span>
                <span className="text-base font-bold text-white">{trend.title}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ background: CATEGORY_COLORS[trend.category] }}
                >
                  {CATEGORY_LABELS[trend.category]}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs text-slate-300 bg-[#242434]">
                  {trend.type.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {/* Relevance Score */}
                <div className="text-center">
                  <div className="text-xs text-slate-500 mb-0.5">관련성</div>
                  <div
                    className="text-lg font-black"
                    style={{
                      color:
                        trend.relevanceScore >= 90
                          ? '#e91e8c'
                          : trend.relevanceScore >= 75
                          ? '#f59e0b'
                          : '#6b7280',
                    }}
                  >
                    {trend.relevanceScore}
                  </div>
                </div>
                {/* Velocity */}
                <div className="text-center">
                  <div className="text-xs text-slate-500 mb-0.5">성장속도</div>
                  <div className="text-lg font-bold text-green-400">
                    +{trend.growthVelocity}%
                  </div>
                </div>
                {/* Peak */}
                <div className="text-center">
                  <div className="text-xs text-slate-500 mb-0.5">피크</div>
                  <div className="text-xs font-medium text-slate-300">{trend.peakEstimate}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300">{trend.description}</p>

            {/* Platforms */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">플랫폼:</span>
              {trend.platform.map((p) => (
                <PlatformBadge key={p} platform={p as Platform} />
              ))}
            </div>

            {/* Action Suggestion */}
            <div className="bg-[#1a1a24] border border-[#242434] rounded-lg p-3">
              <div className="text-xs font-semibold text-[#e91e8c] mb-1">
                🚀 MEP-C 액션 제안
              </div>
              <p className="text-sm text-slate-200">{trend.actionSuggestion}</p>
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5">
              {trend.relatedHashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-xs font-medium bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Example Accounts */}
            <div className="text-xs text-slate-500">
              참고 계정: {trend.exampleAccounts.join(' · ')}
            </div>

            {/* Priority Badge */}
            {idx === 0 && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#e91e8c]">
                🔥 최우선 추천
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
