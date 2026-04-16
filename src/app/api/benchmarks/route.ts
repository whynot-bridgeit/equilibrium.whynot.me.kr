import { NextResponse } from 'next/server';
import { BENCHMARK_TARGETS } from '@/data/trends';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    { benchmarks: BENCHMARK_TARGETS, lastUpdated: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
