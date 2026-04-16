'use client';
import { useState } from 'react';
import { useRefreshData } from '@/hooks/useRefreshData';
import { RefreshControl } from '@/components/RefreshControl';
import { MEMBERS } from '@/data/members';
import type { MemberAnalytics, StyleItem } from '@/types';

interface MembersResponse extends Array<MemberAnalytics> {}

const RECOMMENDATION_COLORS: Record<StyleItem['recommendation'], string> = {
  expand: '#22c55e',
  continue: '#60a5fa',
  reduce: '#f59e0b',
  avoid: '#ef4444',
};

const RECOMMENDATION_LABELS: Record<StyleItem['recommendation'], string> = {
  expand: '✅ 확장 추천',
  continue: '💙 유지',
  reduce: '⚠️ 줄이기',
  avoid: '🚫 지양',
};

function StyleRow({ item }: { item: StyleItem }) {
  return (
    <div className="flex items-center gap-3 bg-[#1a1a24] rounded-lg p-2.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{item.name}</span>
          <span
            className="px-1.5 py-0.5 rounded text-xs font-bold text-white"
            style={{ background: RECOMMENDATION_COLORS[item.recommendation] }}
          >
            {RECOMMENDATION_LABELS[item.recommendation]}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
          <span>인게이지먼트 {item.engagementLift > 0 ? '+' : ''}{item.engagementLift}%</span>
          <span>팬 감성 {item.sentiment}%</span>
          <span>게시 {item.frequency}회</span>
        </div>
      </div>
      {/* Engagement Bar */}
      <div className="w-24 shrink-0">
        <div className="h-1.5 bg-[#242434] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(0, Math.min(100, 50 + item.engagementLift))}%`,
              background: item.engagementLift > 0 ? '#22c55e' : '#ef4444',
            }}
          />
        </div>
        <div
          className={`text-xs text-center mt-0.5 font-bold ${
            item.engagementLift > 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {item.engagementLift > 0 ? '+' : ''}{item.engagementLift}%
        </div>
      </div>
    </div>
  );
}

export default function CoachingPage() {
  const [selectedMember, setSelectedMember] = useState(MEMBERS[0].id);

  const { data, loading, lastUpdated, refresh } =
    useRefreshData<MembersResponse>('/api/members', 60_000);

  const memberAnalytics = data?.find((d) => d.member.id === selectedMember);
  const member = MEMBERS.find((m) => m.id === selectedMember)!;
  const coaching = memberAnalytics?.styleCoaching;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">멤버별 스타일 코칭</h1>
          <p className="text-slate-400 text-sm mt-1">
            팬 반응 데이터 기반 — 헤어 · 메이크업 · 의상 최적화 가이드
          </p>
        </div>
        <RefreshControl onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />
      </div>

      {/* Member Selector */}
      <div className="flex flex-wrap gap-2">
        {MEMBERS.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMember(m.id)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={
              selectedMember === m.id
                ? { background: m.color, color: '#fff' }
                : { background: '#1a1a24', color: '#cbd5e1' }
            }
          >
            {m.flag} {m.stageName}
          </button>
        ))}
      </div>

      {/* Member Header */}
      <div
        className="border rounded-xl p-5 flex items-center gap-4"
        style={{
          borderColor: member.color + '40',
          background: member.color + '0d',
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
          style={{ background: member.color + '25' }}
        >
          {member.flag}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl font-bold text-white">{member.stageName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#242434] text-slate-300">
              {member.countryName}
            </span>
            {member.role.map((r) => (
              <span
                key={r}
                className="text-xs px-2 py-0.5 rounded-full text-white"
                style={{ background: member.color + '50' }}
              >
                {r}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-1">{member.bio}</p>
        </div>
        {memberAnalytics && (
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500">팬 선호도</div>
            <div className="text-3xl font-black" style={{ color: member.color }}>
              {memberAnalytics.fanFavoriteScore}
            </div>
          </div>
        )}
      </div>

      {coaching && (
        <>
          {/* Top Performing Looks */}
          <div className="bg-[#111118] border border-[#242434] rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-3">
              🏆 최고 성과 룩 TOP 3
            </div>
            <div className="flex flex-col gap-2">
              {coaching.topPerformingLooks.map((look, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-[#1a1a24] rounded-lg p-3 text-sm text-slate-200"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: member.color }}
                  >
                    {i + 1}
                  </span>
                  {look}
                </div>
              ))}
            </div>
          </div>

          {/* Style Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hair */}
            <div className="bg-[#111118] border border-[#242434] rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-3">💇‍♀️ 헤어스타일</div>
              <div className="flex flex-col gap-2">
                {coaching.hairStyles
                  .sort((a, b) => b.engagementLift - a.engagementLift)
                  .map((item) => (
                    <StyleRow key={item.name} item={item} />
                  ))}
              </div>
            </div>

            {/* Makeup */}
            <div className="bg-[#111118] border border-[#242434] rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-3">💄 메이크업</div>
              <div className="flex flex-col gap-2">
                {coaching.makeupStyles
                  .sort((a, b) => b.engagementLift - a.engagementLift)
                  .map((item) => (
                    <StyleRow key={item.name} item={item} />
                  ))}
              </div>
            </div>

            {/* Outfit */}
            <div className="bg-[#111118] border border-[#242434] rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-3">👗 의상 스타일</div>
              <div className="flex flex-col gap-2">
                {coaching.outfitStyles
                  .sort((a, b) => b.engagementLift - a.engagementLift)
                  .map((item) => (
                    <StyleRow key={item.name} item={item} />
                  ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-[#111118] border border-[#242434] rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-3">
              📋 마케팅팀 코칭 액션 플랜
            </div>
            <div className="flex flex-col gap-2.5">
              {coaching.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm text-slate-200"
                >
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ background: member.color }}
                  >
                    {i + 1}
                  </span>
                  {rec}
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Note */}
          <div className="bg-[#111118] border border-[#7c3aed]/30 rounded-xl p-5">
            <div className="text-sm font-semibold text-[#a78bfa] mb-2">
              🌏 문화적 스타일링 노트 ({member.countryName})
            </div>
            <p className="text-sm text-slate-300">
              {member.nationality === 'IN' &&
                '인도 전통 의상(사리, 레헨가) 또는 주얼리 요소를 한 달에 한 번 컨텐츠에 자연스럽게 녹여내면 인도 팬덤에 강한 정체성 공감대를 형성합니다. 볼리우드 인플루언서들이 반응하는 트렌드(Mehndi 패턴, 쿠르티 믹스)와 연계한 패션 콘텐츠가 효과적입니다.'}
              {member.nationality === 'NP' &&
                '네팔 전통 의상(Dhaka 패브릭, Topi)이나 히말라야를 연상케 하는 색감(딥 레드, 골드)을 무대 의상에 서브틀하게 활용하면 네팔·히말라야권 팬덤에 강한 소속감을 줍니다. 네팔 미디어는 "최초 네팔 출신 K-팝 아이돌" 내러티브에 매우 반응합니다.'}
              {member.nationality === 'TN' &&
                '튀니지·MENA 미학(아라베스크 패턴, 하마 모티프, 딥 블루·테라코타 팔레트)을 무대 의상이나 포토카드 콘셉트에 도입하면 MENA 지역 4억 팬덤에 어필합니다. 아랍어 캡션과 라마단 특별 콘텐츠는 MENA 틱톡에서 자연 바이럴됩니다.'}
              {member.nationality === 'KR' &&
                '한복 재해석 무대의상, K-뷰티 시그니처 룩(유리 피부, 물광 메이크업)은 글로벌 K-팝 팬덤의 핵심 기대값입니다. 계절별 컨셉(봄/여름/가을/겨울)에 맞춘 색감 전략을 일관되게 유지하여 브랜드 아이덴티티를 강화하세요.'}
              {member.nationality === 'MM' &&
                '미얀마 전통 의상(Longyi, 라카인 패브릭)이나 황금색·딥 그린 컬러 팔레트를 서브틀하게 활용하면 미얀마 디아스포라 팬덤(태국·일본·한국 거주)에 강한 감정적 연결을 만듭니다. 미얀마 관련 컨텐츠는 현지 정치 상황을 고려한 신중한 접근이 필요합니다.'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
