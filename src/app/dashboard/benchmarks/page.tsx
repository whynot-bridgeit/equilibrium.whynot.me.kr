'use client';
import { useState } from 'react';
import { useRefreshData } from '@/hooks/useRefreshData';
import { RefreshControl } from '@/components/RefreshControl';
import { PlatformBadge } from '@/components/PlatformBadge';
import { formatNumber } from '@/lib/utils';
import type { BenchmarkTarget, Platform } from '@/types';

interface BenchmarksResponse {
  benchmarks: BenchmarkTarget[];
  lastUpdated: string;
}

const TYPE_ICONS: Record<string, string> = {
  group: '🎤',
  brand: '🏢',
  influencer: '👤',
  celebrity: '⭐',
};

const TYPE_COLORS: Record<string, string> = {
  group: '#e91e8c',
  brand: '#06b6d4',
  influencer: '#7c3aed',
  celebrity: '#f59e0b',
};

export default function BenchmarksPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | BenchmarkTarget['type']>('all');

  const { data, loading, lastUpdated, refresh } =
    useRefreshData<BenchmarksResponse>('/api/benchmarks', 120_000);

  const items = (data?.benchmarks ?? []).filter(
    (b) => typeFilter === 'all' || b.type === typeFilter
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">벤치마킹 & 콜라보 대상</h1>
          <p className="text-slate-400 text-sm mt-1">
            MEP-C가 참고해야 할 그룹·브랜드·인플루언서·셀럽 분석
          </p>
        </div>
        <RefreshControl onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} autoRefreshSecs={120} />
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'group', 'brand', 'influencer', 'celebrity'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              typeFilter === f
                ? 'bg-[#e91e8c] text-white'
                : 'bg-[#1a1a24] text-slate-300 hover:text-white'
            }`}
          >
            {f === 'all' ? '전체' : `${TYPE_ICONS[f]} ${f.charAt(0).toUpperCase() + f.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((b) => (
          <div
            key={b.id}
            className="bg-[#111118] border border-[#242434] rounded-xl p-5 flex flex-col gap-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl">{TYPE_ICONS[b.type]}</span>
                <span className="text-base font-bold text-white">{b.name}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ background: TYPE_COLORS[b.type] }}
                >
                  {b.type}
                </span>
              </div>
              <div className="text-center shrink-0">
                <div className="text-xs text-slate-500 mb-0.5">관련성</div>
                <div
                  className="text-xl font-black"
                  style={{ color: b.relevanceScore >= 90 ? '#e91e8c' : '#f59e0b' }}
                >
                  {b.relevanceScore}
                </div>
              </div>
            </div>

            {/* Platforms */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">플랫폼:</span>
              {b.platform.map((p) => (
                <PlatformBadge key={p} platform={p as Platform} />
              ))}
              <span className="ml-auto text-xs text-slate-400">
                팔로워 {formatNumber(b.followers)} · ER {b.engagementRate.toFixed(1)}%
              </span>
            </div>

            {/* Reason */}
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-1">벤치마킹 이유</div>
              <p className="text-sm text-slate-300">{b.reason}</p>
            </div>

            {/* Collab Idea */}
            <div className="bg-[#1a1a24] border border-[#242434] rounded-lg p-3">
              <div className="text-xs font-semibold text-[#06b6d4] mb-1">🤝 콜라보 아이디어</div>
              <p className="text-sm text-slate-200">{b.collaborationIdea}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {b.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-xs bg-[#242434] text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
