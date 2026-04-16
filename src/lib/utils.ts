import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatPct(n: number, decimals = 1): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(decimals)}%`;
}

export function formatChange(n: number): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${formatNumber(Math.abs(n))}`;
}

export function platformLabel(platform: string): string {
  const map: Record<string, string> = {
    instagram: 'Instagram',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    twitter: 'X (Twitter)',
    discord: 'Discord',
  };
  return map[platform] ?? platform;
}

export function platformColor(platform: string): string {
  const map: Record<string, string> = {
    instagram: '#e1306c',
    youtube: '#ff0000',
    tiktok: '#010101',
    twitter: '#1da1f2',
    discord: '#5865f2',
  };
  return map[platform] ?? '#888';
}

export function sentimentColor(sentiment: string): string {
  if (sentiment === 'positive') return '#22c55e';
  if (sentiment === 'negative') return '#ef4444';
  return '#94a3b8';
}

export function randomVariant(base: number, maxPct = 0.05): number {
  return Math.round(base * (1 + (Math.random() - 0.5) * maxPct * 2));
}

export function addNoise(data: { followers: number; engagementRate: number }[]): typeof data {
  return data.map((d) => ({
    ...d,
    followers: randomVariant(d.followers, 0.01),
    engagementRate: parseFloat((d.engagementRate + (Math.random() - 0.5) * 0.2).toFixed(2)),
  }));
}
