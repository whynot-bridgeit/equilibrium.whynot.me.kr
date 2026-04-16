import { OVERVIEW_STATS, OFFICIAL_PLATFORMS } from '@/data/mockSocialData';
import { randomVariant } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function buildSnapshot() {
  return {
    type: 'snapshot',
    timestamp: new Date().toISOString(),
    overview: {
      ...OVERVIEW_STATS,
      totalFollowers: randomVariant(OVERVIEW_STATS.totalFollowers, 0.002),
      avgEngagementRate: parseFloat(
        (OVERVIEW_STATS.avgEngagementRate + (Math.random() - 0.5) * 0.1).toFixed(2)
      ),
      activeAlerts: Math.floor(4 + Math.random() * 5),
    },
    platforms: OFFICIAL_PLATFORMS.map((p) => ({
      platform: p.platform,
      handle: p.handle,
      followers: randomVariant(p.followers, 0.002),
      engagementRate: parseFloat(
        (p.engagementRate + (Math.random() - 0.5) * 0.15).toFixed(2)
      ),
      followersChangePct7d: parseFloat(
        (p.followersChangePct7d + (Math.random() - 0.5) * 0.1).toFixed(2)
      ),
    })),
    alerts: [
      {
        id: `a-${Date.now()}`,
        severity: Math.random() > 0.6 ? 'success' : 'info',
        title:
          Math.random() > 0.5
            ? `TikTok follower tick: +${Math.floor(Math.random() * 200 + 50)} this hour`
            : `IG Reel reach spike: ${(1 + Math.random() * 2).toFixed(1)}× baseline`,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        try {
          const payload = `data: ${JSON.stringify(buildSnapshot())}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch {
          clearInterval(timer);
          controller.close();
        }
      };

      // Send immediately on connect
      send();

      // Then every 30 seconds
      const timer = setInterval(send, 30_000);

      // Cleanup on client disconnect (ReadableStream cancel)
      return () => clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
