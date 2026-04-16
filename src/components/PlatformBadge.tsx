import { platformColor, platformLabel } from '@/lib/utils';
import type { Platform } from '@/types';

export function PlatformBadge({ platform }: { platform: Platform }) {
  const icons: Record<Platform, string> = {
    instagram: 'IG',
    youtube: 'YT',
    tiktok: 'TK',
    twitter: 'X',
    discord: 'DC',
  };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-white"
      style={{ backgroundColor: platformColor(platform) }}
      title={platformLabel(platform)}
    >
      {icons[platform]}
    </span>
  );
}
