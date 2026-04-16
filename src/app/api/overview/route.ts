import { NextResponse } from 'next/server';
import { OVERVIEW_STATS, OFFICIAL_PLATFORMS } from '@/data/mockSocialData';
import { randomVariant } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Simulate slight variance on each refresh (real API would call platform APIs here)
  const stats = {
    ...OVERVIEW_STATS,
    totalFollowers: randomVariant(OVERVIEW_STATS.totalFollowers, 0.002),
    avgEngagementRate: parseFloat(
      (OVERVIEW_STATS.avgEngagementRate + (Math.random() - 0.5) * 0.1).toFixed(2)
    ),
    lastUpdated: new Date().toISOString(),
    platforms: OFFICIAL_PLATFORMS.map((p) => ({
      ...p,
      followers: randomVariant(p.followers, 0.002),
      engagementRate: parseFloat(
        (p.engagementRate + (Math.random() - 0.5) * 0.15).toFixed(2)
      ),
    })),
  };

  return NextResponse.json(stats, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
