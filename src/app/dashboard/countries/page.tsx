'use client';
import { useRefreshData } from '@/hooks/useRefreshData';
import { RefreshControl } from '@/components/RefreshControl';
import { formatNumber, formatPct } from '@/lib/utils';
import { PlatformBadge } from '@/components/PlatformBadge';
import type { CountryOpportunity, Platform } from '@/types';

interface CountriesResponse {
  countries: CountryOpportunity[];
  lastUpdated: string;
}

export default function CountriesPage() {
  const { data, loading, lastUpdated, refresh } =
    useRefreshData<CountriesResponse>('/api/countries', 120_000);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">국가별 기회 분석</h1>
          <p className="text-slate-400 text-sm mt-1">
            5개국 멤버 출신 — 인도 · 네팔 · 튀니지 · 한국 · 미얀마 시장 전략
          </p>
        </div>
        <RefreshControl onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} autoRefreshSecs={120} />
      </div>

      {/* Summary Bar */}
      {data && (
        <div className="grid grid-cols-5 gap-2">
          {data.countries.map((c) => (
            <div
              key={c.country}
              className="bg-[#111118] border border-[#242434] rounded-xl p-3 text-center"
            >
              <div className="text-2xl mb-1">{c.flag}</div>
              <div className="text-xs font-bold text-white">{c.country}</div>
              <div className="text-xs text-slate-500 mt-0.5">via {c.member}</div>
              <div className="text-sm font-bold text-green-400 mt-1">
                +{c.growthPct.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">MoM growth</div>
            </div>
          ))}
        </div>
      )}

      {/* Country Detail Cards */}
      {data?.countries.map((c) => (
        <div
          key={c.country}
          className="bg-[#111118] border border-[#242434] rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#242434] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{c.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{c.country}</span>
                  <span className="text-sm text-slate-400">— {c.member} 대표</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{c.marketSize}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-slate-500">현재 팔로워</div>
                <div className="text-xl font-bold text-white">{formatNumber(c.currentFollowers)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500">MoM 성장</div>
                <div className="text-xl font-bold text-green-400">
                  {formatPct(c.growthPct)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opportunities */}
            <div>
              <div className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
                기회 요인
              </div>
              <ul className="flex flex-col gap-1.5">
                {c.opportunities.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div>
              <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                리스크 요인
              </div>
              <ul className="flex flex-col gap-1.5">
                {c.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-red-400 mt-0.5 shrink-0">!</span>
                    {r}
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <div className="text-xs font-semibold text-[#a78bfa] uppercase tracking-wider mb-2">
                  주요 플랫폼
                </div>
                <div className="flex gap-2 flex-wrap">
                  {c.keyPlatforms.map((p) => (
                    <PlatformBadge key={p} platform={p as Platform} />
                  ))}
                </div>
              </div>
            </div>

            {/* Benchmarks */}
            <div>
              <div className="text-xs font-semibold text-[#06b6d4] uppercase tracking-wider mb-2">
                벤치마킹 그룹
              </div>
              <div className="flex flex-col gap-1">
                {c.benchmarkGroups.map((b, i) => (
                  <div key={i} className="text-sm text-slate-300 flex items-center gap-2">
                    <span className="text-[#06b6d4]">→</span>
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div>
              <div className="text-xs font-semibold text-[#e91e8c] uppercase tracking-wider mb-2">
                즉시 실행 액션
              </div>
              <ul className="flex flex-col gap-1.5">
                {c.actionItems.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
                    <span className="text-[#e91e8c] mt-0.5 shrink-0 font-bold">{i + 1}.</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
