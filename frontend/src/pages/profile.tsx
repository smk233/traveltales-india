import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Bookmark } from 'lucide-react';
import axiosInstance from '../helpers/axios-instance';
import { User, Post } from '../types';
import { useAuth } from '../hooks/useAuth';
import useBookmarks from '../hooks/useBookmarks';
import PostCard from '../components/post-card';
import usePosts from '../hooks/usePosts';

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, toggleFollowUser } = useAuth();
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();
  const { likePost } = usePosts();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'tales' | 'bookmarks'>('tales');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/users/${id}`);
        if (res.data.success) {
          const { user, posts } = res.data.data;
          setProfileUser(user);
          setProfilePosts(posts);
          setFollowersCount(user.followers.length);
          if (currentUser) {
            setIsFollowing(user.followers.includes(currentUser._id));
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser || !profileUser) return;
    const followed = await toggleFollowUser(profileUser._id);
    setIsFollowing(followed);
    setFollowersCount((prev) => (followed ? prev + 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">{error || 'Profile Not Found'}</h1>
        <Link to="/" className="text-brand-500 font-semibold flex items-center justify-center gap-2 hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  const isSelf = currentUser ? currentUser._id === profileUser._id : false;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={profileUser.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder'}
            alt={profileUser.name}
            className="w-24 h-24 rounded-full border-4 border-brand-100 dark:border-slate-800 object-cover"
          />

          <div className="flex-grow text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center justify-center sm:justify-start gap-2">
                  {profileUser.name}
                  {profileUser.role === 'admin' && (
                    <span className="text-[10px] bg-brand-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded-full uppercase">
                      Admin
                    </span>
                  )}
                </h1>
                <p className="text-xs text-gray-400 mt-1">Joined {new Date(profileUser.createdAt).toLocaleDateString()}</p>
              </div>

              {currentUser && !isSelf && (
                <button
                  onClick={handleFollowToggle}
                  className={`text-sm font-bold px-6 py-2 rounded-full border transition-all cursor-pointer ${
                    isFollowing
                      ? 'bg-gray-100 border-gray-200 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                      : 'bg-brand-500 border-brand-500 text-white hover:bg-brand-600 shadow-sm'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow User'}
                </button>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-slate-300 mt-4 max-w-2xl font-light">
              {profileUser.bio || "No bio added yet. This explorer is busy traveling around India!"}
            </p>

            <div className="flex justify-center sm:justify-start gap-6 mt-6 text-sm">
              <div>
                <span className="font-bold text-gray-800 dark:text-slate-200">{profilePosts.length}</span>
                <span className="text-gray-500 text-xs ml-1">Tales</span>
              </div>
              <div>
                <span className="font-bold text-gray-800 dark:text-slate-200">{followersCount}</span>
                <span className="text-gray-500 text-xs ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold text-gray-800 dark:text-slate-200">{profileUser.following?.length || 0}</span>
                <span className="text-gray-500 text-xs ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('tales')}
            className={`flex items-center gap-1.5 pb-4 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'tales'
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {isSelf ? 'My Tales' : `${profileUser.name.split(' ')[0]}'s Tales`}
          </button>

          {isSelf && (
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-1.5 pb-4 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'bookmarks'
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Bookmarked Tales ({bookmarks.length})
            </button>
          )}
        </div>

        {activeTab === 'tales' ? (
          profilePosts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed dark:border-slate-800">
              <p className="text-gray-500 dark:text-slate-400 text-sm">No stories published yet.</p>
              {isSelf && (
                <Link
                  to="/create-blog"
                  className="inline-block mt-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-full"
                >
                  Write Your First Tale
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profilePosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={likePost}
                  isBookmarked={isBookmarked(post._id)}
                  onBookmarkToggle={toggleBookmark}
                />
              ))}
            </div>
          )
        ) : (
          bookmarks.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed dark:border-slate-800">
              <p className="text-gray-500 dark:text-slate-400 text-sm">No bookmarked stories yet.</p>
              <Link
                to="/"
                className="inline-block mt-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-full"
              >
                Explore Feed
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={likePost}
                  isBookmarked={true}
                  onBookmarkToggle={toggleBookmark}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default Profile;
