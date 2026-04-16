/**
 * Live social media API fetchers.
 * Each function replaces the mock data in the corresponding API route.
 *
 * Prerequisites:
 *   - Meta Business Account with Instagram connected as Professional Account
 *   - Meta App with instagram_basic, instagram_manage_insights permissions
 *   - Long-lived User Access Token (60-day expiry) or System User Token (never expires)
 */

// ─── Instagram Graph API ──────────────────────────────────────────────────────

export async function fetchInstagramProfile(igUserId: string) {
  const token = process.env.META_ACCESS_TOKEN!;
  const fields = 'id,username,followers_count,media_count,biography,profile_picture_url';
  const url = `https://graph.facebook.com/v20.0/${igUserId}?fields=${fields}&access_token=${token}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Instagram profile fetch failed: ${res.status}`);
  return res.json() as Promise<{
    id: string;
    username: string;
    followers_count: number;
    media_count: number;
  }>;
}

export async function fetchInstagramInsights(igUserId: string) {
  const token = process.env.META_ACCESS_TOKEN!;
  // Account-level insights: reach, impressions, profile_views (requires insights permission)
  const metrics = 'reach,impressions,profile_views,follower_count';
  const url = `https://graph.facebook.com/v20.0/${igUserId}/insights?metric=${metrics}&period=day&access_token=${token}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Instagram insights fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchInstagramMediaEngagement(igUserId: string, limit = 20) {
  const token = process.env.META_ACCESS_TOKEN!;
  const fields = 'id,timestamp,like_count,comments_count,insights.metric(reach,impressions,engagement)';
  const url = `https://graph.facebook.com/v20.0/${igUserId}/media?fields=${fields}&limit=${limit}&access_token=${token}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Instagram media fetch failed: ${res.status}`);
  return res.json();
}

// ─── YouTube Data API v3 ──────────────────────────────────────────────────────

export async function fetchYouTubeChannel() {
  const key = process.env.YOUTUBE_API_KEY!;
  const channelId = process.env.YOUTUBE_CHANNEL_ID!;
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${key}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`YouTube channel fetch failed: ${res.status}`);
  const data = await res.json();
  const ch = data.items?.[0];
  return {
    subscriberCount: parseInt(ch?.statistics?.subscriberCount ?? '0'),
    viewCount: parseInt(ch?.statistics?.viewCount ?? '0'),
    videoCount: parseInt(ch?.statistics?.videoCount ?? '0'),
    title: ch?.snippet?.title,
  };
}

export async function fetchYouTubeRecentVideos(maxResults = 10) {
  const key = process.env.YOUTUBE_API_KEY!;
  const channelId = process.env.YOUTUBE_CHANNEL_ID!;

  // Step 1: get video IDs from search
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${key}`;
  const searchRes = await fetch(searchUrl, { next: { revalidate: 600 } });
  const searchData = await searchRes.json();
  const ids = (searchData.items ?? []).map((i: { id: { videoId: string } }) => i.id.videoId).join(',');

  if (!ids) return [];

  // Step 2: get statistics for those IDs
  const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${ids}&key=${key}`;
  const statsRes = await fetch(statsUrl, { next: { revalidate: 600 } });
  const statsData = await statsRes.json();

  return (statsData.items ?? []).map((v: {
    snippet: { title: string; publishedAt: string };
    statistics: { viewCount: string; likeCount: string; commentCount: string };
  }) => ({
    title: v.snippet.title,
    publishedAt: v.snippet.publishedAt,
    views: parseInt(v.statistics.viewCount ?? '0'),
    likes: parseInt(v.statistics.likeCount ?? '0'),
    comments: parseInt(v.statistics.commentCount ?? '0'),
  }));
}

// ─── Twitter / X API v2 ───────────────────────────────────────────────────────

export async function fetchTwitterUser(username: string) {
  const token = process.env.TWITTER_BEARER_TOKEN!;
  const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics,description`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Twitter user fetch failed: ${res.status}`);
  const data = await res.json();
  return {
    followersCount: data.data?.public_metrics?.followers_count ?? 0,
    followingCount: data.data?.public_metrics?.following_count ?? 0,
    tweetCount: data.data?.public_metrics?.tweet_count ?? 0,
  };
}

export async function fetchTwitterRecentTweets(userId: string, maxResults = 20) {
  const token = process.env.TWITTER_BEARER_TOKEN!;
  const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=public_metrics,created_at&exclude=retweets,replies`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`Twitter tweets fetch failed: ${res.status}`);
  const data = await res.json();
  return (data.data ?? []).map((t: {
    text: string;
    created_at: string;
    public_metrics: { like_count: number; retweet_count: number; reply_count: number; impression_count: number };
  }) => ({
    text: t.text,
    createdAt: t.created_at,
    likes: t.public_metrics.like_count,
    retweets: t.public_metrics.retweet_count,
    replies: t.public_metrics.reply_count,
    impressions: t.public_metrics.impression_count,
  }));
}

// ─── TikTok Research API ──────────────────────────────────────────────────────
// Note: TikTok Research API requires approved researcher application.
// For marketing use, TikTok Business API or unofficial scraping libs may be needed.

export async function fetchTikTokToken() {
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      grant_type: 'client_credentials',
    }),
  });
  const data = await res.json();
  return data.access_token as string;
}

export async function fetchTikTokUserInfo(username: string) {
  const token = await fetchTikTokToken();
  const res = await fetch('https://open.tiktokapis.com/v2/research/user/info/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      fields: ['display_name', 'bio_description', 'follower_count', 'following_count', 'likes_count', 'video_count'],
    }),
  });
  if (!res.ok) throw new Error(`TikTok user fetch failed: ${res.status}`);
  const data = await res.json();
  return {
    followerCount: data.data?.user_info?.follower_count ?? 0,
    likesCount: data.data?.user_info?.likes_count ?? 0,
    videoCount: data.data?.user_info?.video_count ?? 0,
  };
}
