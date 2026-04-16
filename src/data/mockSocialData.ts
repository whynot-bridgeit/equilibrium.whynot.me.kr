import type {
  PlatformMetrics,
  MemberAnalytics,
  OverviewStats,
  DayData,
  Alert,
} from '@/types';
import { MEMBERS } from './members';

function generateTrendData(
  baseFollowers: number,
  days = 30,
  volatility = 0.004,
  trend = 0.003
): DayData[] {
  const data: DayData[] = [];
  let followers = baseFollowers * 0.88;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const spike = i === 18 ? 1.04 : i === 9 ? 1.025 : 1;
    followers = Math.round(
      followers * (1 + trend + (Math.random() - 0.45) * volatility) * spike
    );
    data.push({
      date: date.toISOString().slice(0, 10),
      followers,
      engagementRate: parseFloat(
        (3.2 + Math.random() * 2.8 + (i < 10 ? 0.5 : 0)).toFixed(2)
      ),
      likes: Math.round(followers * 0.04 * (0.8 + Math.random() * 0.4)),
      comments: Math.round(followers * 0.006 * (0.7 + Math.random() * 0.6)),
    });
  }
  return data;
}

function makeAlerts(memberId: string): Alert[] {
  const base: Alert[] = [
    {
      id: `${memberId}-1`,
      severity: 'success',
      title: 'Follower Spike Detected +4.1%',
      description:
        'Unusual growth on Day 18 linked to a viral Reels collaboration. Engagement jumped 62% above baseline.',
      action: 'Boost the post and create follow-up content on the same theme.',
      timestamp: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
    {
      id: `${memberId}-2`,
      severity: 'warning',
      title: 'Engagement Dip (–0.8 pp)',
      description:
        'Engagement rate dropped for 3 consecutive days. Posts during KST off-peak hours may be contributing.',
      action: 'Shift posting schedule to 7–9 PM KST and increase Story frequency.',
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: `${memberId}-3`,
      severity: 'info',
      title: 'New Country Entering Top-5',
      description:
        'Indonesia now 4th in follower geography, displacing Philippines. Monitor SEA market more closely.',
      action: 'Consider adding Bahasa Indonesia captions to key posts.',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];
  return base;
}

function makePlatformMetrics(
  platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'discord',
  handle: string,
  baseFollowers: number
): PlatformMetrics {
  const trendData = generateTrendData(baseFollowers);
  const current = trendData[trendData.length - 1].followers;
  const week7 = trendData[trendData.length - 8].followers;
  const month30 = trendData[0].followers;

  return {
    platform,
    handle,
    followers: current,
    followersChange7d: current - week7,
    followersChangePct7d: parseFloat((((current - week7) / week7) * 100).toFixed(2)),
    followersChange30d: current - month30,
    followersChangePct30d: parseFloat((((current - month30) / month30) * 100).toFixed(2)),
    engagementRate: parseFloat((3.5 + Math.random() * 3).toFixed(2)),
    engagementRateChange7d: parseFloat(((Math.random() - 0.4) * 1.2).toFixed(2)),
    avgLikes: Math.round(current * 0.042),
    avgComments: Math.round(current * 0.007),
    avgShares: Math.round(current * 0.003),
    postsCount: Math.floor(20 + Math.random() * 40),
    reachEstimate: Math.round(current * (2 + Math.random() * 3)),
    demographics: {
      gender: { female: 72, male: 24, other: 4 },
      ageGroups: [
        { label: '13–17', pct: 18 },
        { label: '18–24', pct: 41 },
        { label: '25–34', pct: 28 },
        { label: '35–44', pct: 9 },
        { label: '45+', pct: 4 },
      ],
      topCountries: [
        { country: 'South Korea', flag: '🇰🇷', pct: 22 },
        { country: 'United States', flag: '🇺🇸', pct: 14 },
        { country: 'India', flag: '🇮🇳', pct: 11 },
        { country: 'Indonesia', flag: '🇮🇩', pct: 8 },
        { country: 'Philippines', flag: '🇵🇭', pct: 7 },
      ],
      topCities: [
        { city: 'Seoul', country: 'KR', pct: 9 },
        { city: 'Jakarta', country: 'ID', pct: 5 },
        { city: 'Mumbai', country: 'IN', pct: 4 },
        { city: 'Los Angeles', country: 'US', pct: 4 },
        { city: 'Bangkok', country: 'TH', pct: 3 },
      ],
    },
    trendData,
    topComments: [
      {
        text: '언니 너무 예뻐요 💕 진짜 최고',
        sentiment: 'positive',
        language: 'Korean',
        likes: 1243,
      },
      {
        text: 'I cannot stop watching this, she\'s amazing 🔥',
        sentiment: 'positive',
        language: 'English',
        likes: 987,
      },
      {
        text: 'आपकी आवाज़ बहुत सुंदर है! 🎤',
        sentiment: 'positive',
        language: 'Hindi',
        likes: 754,
      },
      {
        text: 'The styling this era is giving 😭🙌',
        sentiment: 'positive',
        language: 'English',
        likes: 631,
      },
      {
        text: 'Could you please post more content? We miss you!',
        sentiment: 'neutral',
        language: 'English',
        likes: 412,
      },
    ],
    topKeywords: [
      { keyword: '#MEPC', count: 18432, trend: 'up', sentiment: 'positive' },
      { keyword: '#GBKEntertainment', count: 9214, trend: 'up', sentiment: 'positive' },
      { keyword: '#Kpop', count: 45321, trend: 'neutral', sentiment: 'positive' },
      { keyword: '#MultiEthnic', count: 7832, trend: 'up', sentiment: 'positive' },
      { keyword: '#MEPC_comeback', count: 5124, trend: 'up', sentiment: 'positive' },
    ],
    alerts: makeAlerts(handle),
  };
}

export const OFFICIAL_PLATFORMS: PlatformMetrics[] = [
  makePlatformMetrics('instagram', 'mepc_official', 423456),
  makePlatformMetrics('youtube', 'mepc_official', 312445),
  makePlatformMetrics('tiktok', 'mepc_official', 892113),
  makePlatformMetrics('twitter', 'mepc_official', 187234),
];

const memberBaseFollowers: Record<string, number> = {
  miho: 127543,
  kkekke: 98211,
  anika: 143892,
  hara: 89765,
  ann: 112334,
  zaylie: 156789,
  solmi: 76543,
};

export const MEMBER_ANALYTICS: MemberAnalytics[] = MEMBERS.map((member) => ({
  member,
  platforms: [
    makePlatformMetrics(
      'instagram',
      `mepc_${member.id}`,
      memberBaseFollowers[member.id]
    ),
  ],
  contentScore: Math.round(70 + Math.random() * 25),
  fanFavoriteScore: Math.round(65 + Math.random() * 30),
  styleCoaching: {
    hairStyles: [
      {
        name: 'Two-tone Color Split',
        engagementLift: 38,
        sentiment: 91,
        frequency: 4,
        recommendation: 'expand',
      },
      {
        name: 'Sleek High Ponytail',
        engagementLift: 22,
        sentiment: 88,
        frequency: 7,
        recommendation: 'continue',
      },
      {
        name: 'Bangs + Straight',
        engagementLift: 14,
        sentiment: 79,
        frequency: 3,
        recommendation: 'continue',
      },
      {
        name: 'Messy Bun',
        engagementLift: -5,
        sentiment: 65,
        frequency: 2,
        recommendation: 'reduce',
      },
    ],
    makeupStyles: [
      {
        name: 'Glass Skin Dewy',
        engagementLift: 45,
        sentiment: 93,
        frequency: 8,
        recommendation: 'expand',
      },
      {
        name: 'Graphic Liner',
        engagementLift: 31,
        sentiment: 87,
        frequency: 5,
        recommendation: 'expand',
      },
      {
        name: 'Monochromatic Pink',
        engagementLift: 19,
        sentiment: 84,
        frequency: 6,
        recommendation: 'continue',
      },
      {
        name: 'Heavy Contour',
        engagementLift: -8,
        sentiment: 61,
        frequency: 2,
        recommendation: 'avoid',
      },
    ],
    outfitStyles: [
      {
        name: 'Y2K Streetwear',
        engagementLift: 52,
        sentiment: 94,
        frequency: 6,
        recommendation: 'expand',
      },
      {
        name: 'Pastel Coordinated Sets',
        engagementLift: 28,
        sentiment: 89,
        frequency: 7,
        recommendation: 'continue',
      },
      {
        name: 'Avant-garde Stage Fit',
        engagementLift: 35,
        sentiment: 91,
        frequency: 4,
        recommendation: 'expand',
      },
      {
        name: 'Oversized Casual',
        engagementLift: 11,
        sentiment: 76,
        frequency: 5,
        recommendation: 'continue',
      },
    ],
    topPerformingLooks: [
      'Comeback stage look — two-tone hair + glass skin + Y2K stage fit (+52% engagement)',
      'Birthday Vlive casual look — sleek pony + dewy makeup (+38% comments)',
      'Airport fashion — oversized pastel set, graphic liner (+29% saves)',
    ],
    recommendations: [
      'Increase "Glass Skin Dewy" makeup frequency — highest comment sentiment score (93%) among all looks.',
      'Two-tone hair color generates 38% engagement lift. Plan next color drop as a content event.',
      'Y2K Streetwear drives saves (+52%) — coordinate with brand or stylist for a dedicated fashion series.',
      'Avoid heavy contour — fan comments explicitly prefer natural/dewy aesthetic.',
      'Introduce traditional home-country fashion element in one post/month for cultural storytelling.',
    ],
  },
}));

export const OVERVIEW_STATS: OverviewStats = {
  totalFollowers:
    OFFICIAL_PLATFORMS.reduce((s, p) => s + p.followers, 0) +
    MEMBER_ANALYTICS.reduce(
      (s, m) => s + m.platforms.reduce((ps, p) => ps + p.followers, 0),
      0
    ),
  totalFollowersChange7d: 34210,
  totalFollowersChangePct7d: 2.18,
  avgEngagementRate: 5.34,
  avgEngagementRateChange7d: 0.42,
  totalReach: 8_234_000,
  activeAlerts: 6,
};
