import { NextResponse } from 'next/server';
import { COUNTRY_OPPORTUNITIES } from '@/data/trends';
import { randomVariant } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = COUNTRY_OPPORTUNITIES.map((c) => ({
    ...c,
    currentFollowers: randomVariant(c.currentFollowers, 0.003),
    growthPct: parseFloat((c.growthPct + (Math.random() - 0.4) * 0.5).toFixed(1)),
  }));

  return NextResponse.json(
    { countries: data, lastUpdated: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
