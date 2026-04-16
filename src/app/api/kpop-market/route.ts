import { NextResponse } from 'next/server';
import { KPOP_GROUPS, KPOP_MARKET_STATS } from '@/data/kpopGroups';
import { randomVariant } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const groups = KPOP_GROUPS.map((g) => ({
    ...g,
    totalInstagramFollowers: randomVariant(g.totalInstagramFollowers, 0.003),
    totalTiktokFollowers: randomVariant(g.totalTiktokFollowers, 0.005),
    engagementRate: parseFloat(
      (g.engagementRate + (Math.random() - 0.5) * 0.1).toFixed(2)
    ),
    weeklyGrowthPct: parseFloat(
      (g.weeklyGrowthPct + (Math.random() - 0.5) * 0.1).toFixed(2)
    ),
  }));

  return NextResponse.json(
    { groups, marketStats: KPOP_MARKET_STATS, lastUpdated: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
