import cacheService from '../services/redis';
import { CACHE_TTL } from './constants';

export const cachePostsHelper = {
  // Home Feed
  getCachedHomeFeed: async () => {
    const data = await cacheService.get('feed:home');
    return data ? JSON.parse(data) : null;
  },
  setCachedHomeFeed: async (posts: any) => {
    await cacheService.set('feed:home', JSON.stringify(posts), { EX: CACHE_TTL.HOME_FEED });
  },
  invalidateHomeFeed: async () => {
    await cacheService.del('feed:home');
  },

  // Featured Posts
  getCachedFeaturedPosts: async () => {
    const data = await cacheService.get('posts:featured');
    return data ? JSON.parse(data) : null;
  },
  setCachedFeaturedPosts: async (posts: any) => {
    await cacheService.set('posts:featured', JSON.stringify(posts), { EX: CACHE_TTL.FEATURED_POSTS });
  },
  invalidateFeaturedPosts: async () => {
    await cacheService.del('posts:featured');
  },

  // Trending Blogs
  getCachedTrendingBlogs: async () => {
    const data = await cacheService.get('posts:trending');
    return data ? JSON.parse(data) : null;
  },
  setCachedTrendingBlogs: async (posts: any) => {
    await cacheService.set('posts:trending', JSON.stringify(posts), { EX: CACHE_TTL.TRENDING_POSTS });
  },
  invalidateTrendingBlogs: async () => {
    await cacheService.del('posts:trending');
  },

  // Destinations
  getCachedDestinations: async () => {
    const data = await cacheService.get('destinations:all');
    return data ? JSON.parse(data) : null;
  },
  setCachedDestinations: async (destinations: any) => {
    await cacheService.set('destinations:all', JSON.stringify(destinations), { EX: CACHE_TTL.DESTINATIONS });
  },
  invalidateDestinations: async () => {
    await cacheService.del('destinations:all');
  },

  // Search Results
  getCachedSearchResults: async (query: string) => {
    const data = await cacheService.get(`search:query:${query.toLowerCase()}`);
    return data ? JSON.parse(data) : null;
  },
  setCachedSearchResults: async (query: string, posts: any) => {
    await cacheService.set(`search:query:${query.toLowerCase()}`, JSON.stringify(posts), {
      EX: CACHE_TTL.SEARCH_RESULTS,
    });
  },
  invalidateSearchResults: async () => {
    await cacheService.invalidatePattern('search:query:*');
  },

  // Invalidate all post-related caches
  invalidateAllPostsCache: async () => {
    await Promise.all([
      cachePostsHelper.invalidateHomeFeed(),
      cachePostsHelper.invalidateFeaturedPosts(),
      cachePostsHelper.invalidateTrendingBlogs(),
      cachePostsHelper.invalidateSearchResults(),
    ]);
  },
};
