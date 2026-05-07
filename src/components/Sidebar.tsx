'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV = [
  {
    section: 'MEP-C',
    items: [
      { href: '/dashboard', label: '📊 Overview', exact: true },
      { href: '/dashboard/mepc', label: '⭐ 채널별 모니터링' },
      { href: '/dashboard/coaching', label: '💄 멤버 스타일 코칭' },
    ],
  },
  {
    section: 'K-POP 시장',
    items: [
      { href: '/dashboard/kpop-market', label: '🎤 K-POP 전체 시장' },
      { href: '/dashboard/multinational', label: '🌍 다국적 그룹 비교' },
    ],
  },
  {
    section: '전략',
    items: [
      { href: '/dashboard/trends', label: '🔥 트렌드 & 컨텐츠 제안' },
      { href: '/dashboard/benchmarks', label: '🤝 벤치마킹 & 콜라보' },
      { href: '/dashboard/countries', label: '🗺️ 국가별 기회 분석' },
      { href: '/dashboard/sourcing', label: '🛒 이커머스 소싱' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-[#0d0d14] border-r border-[#242434] flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#242434]">
        <div className="text-white font-black text-lg tracking-tight">
          GBK<span className="text-[#e91e8c]">.</span>Social
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
          MEP-C Marketing Intelligence
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-5">
        {NAV.map((section) => (
          <div key={section.section}>
            <div className="text-[10px] text-slate-600 uppercase tracking-widest px-2 mb-1.5 font-medium">
              {section.section}
            </div>
            {section.items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href) && item.href !== '/dashboard';
              const activeExact = item.exact && pathname === '/dashboard';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                    activeExact || active
                      ? 'bg-[#e91e8c]/15 text-[#e91e8c] font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-[#1a1a24]'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#242434]">
        <div className="text-[10px] text-slate-600">
          GBK Entertainment © 2024
        </div>
        <div className="text-[10px] text-slate-700 mt-0.5">
          Demo Mode — Connect APIs for live data
        </div>
      </div>
    </aside>
  );
}
