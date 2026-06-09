import React, { useEffect, useState, useCallback } from 'react';
import Hero from '../components/hero';
import FeaturedStoryCard from '../components/featured-story-card';
import PostCard from '../components/post-card';
import { CardSkeleton, FeaturedSkeleton } from '../components/skeletons';
import usePosts from '../hooks/usePosts';
import useBookmarks from '../hooks/useBookmarks';
import axiosInstance from '../helpers/axios-instance';
import { Post } from '../types';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const {
    posts,
    featured,
    trending,
    loading,
    fetchHomeFeed,
    fetchFeatured,
    fetchTrending,
    likePost,
  } = usePosts();

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchHomeFeed();
    fetchFeatured();
    fetchTrending();
  }, [fetchHomeFeed, fetchFeatured, fetchTrending]);

  useEffect(() => {
    setDisplayPosts(posts);
  }, [posts]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchActive(false);
      setDisplayPosts(posts);
      return;
    }
    try {
      setSearchLoading(true);
      setSearchActive(true);
      const res = await axiosInstance.get(`/posts/search?q=${encodeURIComponent(query)}`);
      if (res.data.success) {
        setDisplayPosts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  }, [posts]);

  const handleFilterState = useCallback((state: string) => {
    setSelectedState(state);
    if (state === 'All') {
      setDisplayPosts(posts);
    } else {
      const filtered = posts.filter(
        (p) => p.state?.toLowerCase() === state.toLowerCase()
      );
      setDisplayPosts(filtered);
    }
  }, [posts]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors">
      <Hero onSearch={handleSearch} onFilterState={handleFilterState} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {!searchActive && selectedState === 'All' && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-brand-500 rounded-full inline-block" />
              Featured Story
            </h2>
            {loading && featured.length === 0 ? (
              <FeaturedSkeleton />
            ) : featured.length > 0 ? (
              <FeaturedStoryCard post={featured[0]} />
            ) : (
              <p className="text-gray-400 text-sm">No featured story yet.</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-brand-500 rounded-full inline-block" />
              {searchActive
                ? `Search Results for "${searchQuery}"`
                : selectedState !== 'All'
                ? `Tales from ${selectedState}`
                : 'Latest Travel Tales'}
            </h2>

            {loading || searchLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : displayPosts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed dark:border-slate-800">
                <p className="text-gray-500 dark:text-slate-400 text-sm">No travel tales found. Be the first to tell yours!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={likePost}
                    isBookmarked={isBookmarked(post._id)}
                    onBookmarkToggle={toggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-slate-100 flex items-center gap-2">
                🔥 Trending Tales
              </h3>
              <div className="space-y-4">
                {trending.slice(0, 5).map((tPost, idx) => (
                  <div key={tPost._id} className="flex gap-3 items-start border-b border-gray-50 dark:border-slate-800 pb-3 last:border-none last:pb-0">
                    <span className="text-2xl font-extrabold text-brand-100 dark:text-slate-800 shrink-0">
                      0{idx + 1}
                    </span>
                    <div>
                      <Link
                        to={`/blog/${tPost.slug}`}
                        className="text-sm font-bold text-gray-800 dark:text-slate-200 hover:text-brand-500 transition-colors line-clamp-2 leading-snug"
                      >
                        {tPost.title}
                      </Link>
                      <span className="text-[10px] text-gray-400 dark:text-slate-400 font-semibold block mt-1">
                        By {tPost.author?.name} • {tPost.likes.length} likes
                      </span>
                    </div>
                  </div>
                ))}
                {trending.length === 0 && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 italic">No trending stories yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
