import { NextResponse } from 'next/server';
import { TRENDING_CONTENT } from '@/data/trends';
import { randomVariant } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = TRENDING_CONTENT.map((t) => ({
    ...t,
    relevanceScore: Math.min(100, randomVariant(t.relevanceScore, 0.03)),
    growthVelocity: randomVariant(t.growthVelocity, 0.05),
  })).sort((a, b) => b.relevanceScore - a.relevanceScore);

  return NextResponse.json(
    { trends: data, lastUpdated: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
