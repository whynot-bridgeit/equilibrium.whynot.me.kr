export type Platform = 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'discord';
export type Nationality = 'KR' | 'IN' | 'NP' | 'TN' | 'MM';
export type Gender = 'female' | 'male' | 'other';
export type TrendDirection = 'up' | 'down' | 'neutral';
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

export interface Member {
  id: string;
  stageName: string;
  realName: string;
  nationality: Nationality;
  countryName: string;
  flag: string;
  color: string;
  handles: Partial<Record<Platform, string>>;
  birthYear: number;
  role: string[];
  bio: string;
}

export interface DemographicBreakdown {
  gender: { female: number; male: number; other: number };
  ageGroups: { label: string; pct: number }[];
  topCountries: { country: string; flag: string; pct: number }[];
  topCities: { city: string; country: string; pct: number }[];
}

export interface PlatformMetrics {
  platform: Platform;
  handle: string;
  followers: number;
  followersChange7d: number;
  followersChangePct7d: number;
  followersChange30d: number;
  followersChangePct30d: number;
  engagementRate: number;
  engagementRateChange7d: number;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  postsCount: number;
  reachEstimate: number;
  demographics: DemographicBreakdown;
  trendData: DayData[];
  topComments: CommentSample[];
  topKeywords: KeywordStat[];
  alerts: Alert[];
}

export interface DayData {
  date: string;
  followers: number;
  engagementRate: number;
  likes: number;
  comments: number;
}

export interface CommentSample {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  language: string;
  likes: number;
}

export interface KeywordStat {
  keyword: string;
  count: number;
  trend: TrendDirection;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  action?: string;
  timestamp: string;
}

export interface MemberAnalytics {
  member: Member;
  platforms: PlatformMetrics[];
  styleCoaching: StyleCoaching;
  contentScore: number;
  fanFavoriteScore: number;
}

export interface StyleCoaching {
  hairStyles: StyleItem[];
  makeupStyles: StyleItem[];
  outfitStyles: StyleItem[];
  topPerformingLooks: string[];
  recommendations: string[];
}

export interface StyleItem {
  name: string;
  engagementLift: number;
  sentiment: number;
  frequency: number;
  recommendation: 'continue' | 'expand' | 'reduce' | 'avoid';
}

export interface KpopGroup {
  name: string;
  agency: string;
  debutYear: number;
  memberCount: number;
  foreignMemberCount: number;
  foreignNationalities: Nationality[];
  totalInstagramFollowers: number;
  totalYoutubeSubscribers: number;
  totalTiktokFollowers: number;
  engagementRate: number;
  weeklyGrowthPct: number;
  notes: string;
}

export interface TrendingContent {
  id: string;
  type: 'keyword' | 'meme' | 'challenge' | 'sound' | 'format';
  title: string;
  description: string;
  platform: Platform[];
  relevanceScore: number;
  growthVelocity: number;
  peakEstimate: string;
  category: 'existing-fan' | 'new-fan' | 'both';
  actionSuggestion: string;
  relatedHashtags: string[];
  exampleAccounts: string[];
}

export interface BenchmarkTarget {
  id: string;
  type: 'group' | 'brand' | 'influencer' | 'celebrity';
  name: string;
  platform: Platform[];
  followers: number;
  engagementRate: number;
  reason: string;
  collaborationIdea: string;
  relevanceScore: number;
  tags: string[];
}

export interface CountryOpportunity {
  country: string;
  nationality: Nationality;
  flag: string;
  member: string;
  currentFollowers: number;
  growthPct: number;
  marketSize: string;
  opportunities: string[];
  risks: string[];
  benchmarkGroups: string[];
  keyPlatforms: Platform[];
  actionItems: string[];
}

export interface OverviewStats {
  totalFollowers: number;
  totalFollowersChange7d: number;
  totalFollowersChangePct7d: number;
  avgEngagementRate: number;
  avgEngagementRateChange7d: number;
  totalReach: number;
  activeAlerts: number;
}
