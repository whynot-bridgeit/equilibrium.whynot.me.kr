import { NextResponse } from 'next/server';
import { MEMBER_ANALYTICS } from '@/data/mockSocialData';
import { randomVariant } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = MEMBER_ANALYTICS.map((ma) => ({
    ...ma,
    platforms: ma.platforms.map((p) => ({
      ...p,
      followers: randomVariant(p.followers, 0.002),
      engagementRate: parseFloat(
        (p.engagementRate + (Math.random() - 0.5) * 0.2).toFixed(2)
      ),
    })),
    lastUpdated: new Date().toISOString(),
  }));

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
