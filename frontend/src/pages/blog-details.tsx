import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, MapPin, Calendar, ArrowLeft, Trash2 } from 'lucide-react';
import axiosInstance from '../helpers/axios-instance';
import { Post } from '../types';
import { useAuth } from '../hooks/useAuth';
import useBookmarks from '../hooks/useBookmarks';
import CommentSection from '../components/comment-section';

export const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, toggleFollowUser } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/posts/slug/${slug}`);
        if (res.data.success) {
          const postData = res.data.data;
          setPost(postData);
          setLikesCount(postData.likes.length);
          if (user) {
            setIsLiked(postData.likes.includes(user._id));
            setIsFollowing(user.following.includes(postData.author?._id));
          }
        }
      } catch (err: any) {
        setError(err.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, user]);

  const handleLike = async () => {
    if (!user || !post) return;
    try {
      const res = await axiosInstance.post(`/posts/${post._id}/like`);
      if (res.data.success) {
        setIsLiked(res.data.data.liked);
        setLikesCount(res.data.data.likesCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !post) return;
    const followed = await toggleFollowUser(post.author._id);
    setIsFollowing(followed);
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm('Are you sure you want to delete this travel tale? This cannot be undone.')) return;
    try {
      const res = await axiosInstance.delete(`/posts/${post._id}`);
      if (res.data.success) {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">{error || 'Post Not Found'}</h1>
        <Link to="/" className="text-brand-500 font-semibold flex items-center justify-center gap-2 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to feed
        </Link>
      </div>
    );
  }

  const isAuthor = user ? post.author?._id === user._id : false;
  const isAdmin = user ? user.role === 'admin' : false;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {(isAuthor || isAdmin) && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeletePost}
              className="p-2 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
              title="Delete Post"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span>•</span>
          <Link
            to={`/destination/${post.destination?._id}`}
            className="flex items-center gap-1 text-brand-500 hover:underline"
          >
            <MapPin className="w-3.5 h-3.5" />
            {post.destination?.name || post.city}
          </Link>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-slate-100 leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500 dark:text-slate-300 text-lg sm:text-xl font-light mb-8">
          {post.description}
        </p>

        <div className="flex flex-wrap justify-between items-center gap-4 border-y border-gray-100 dark:border-slate-800 py-4 mb-8">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.author?._id}`}>
              <img
                src={post.author?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder'}
                alt={post.author?.name}
                className="w-12 h-12 rounded-full border object-cover"
              />
            </Link>
            <div>
              <Link
                to={`/profile/${post.author?._id}`}
                className="font-bold text-gray-900 dark:text-slate-200 hover:text-brand-500 transition-colors block text-sm"
              >
                {post.author?.name}
              </Link>
              <span className="text-xs text-gray-400">Travel vlogger & blogger</span>
            </div>

            {user && !isAuthor && (
              <button
                onClick={handleFollowToggle}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ml-3 ${
                  isFollowing
                    ? 'bg-gray-100 border-gray-200 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    : 'bg-brand-500 border-brand-500 text-white hover:bg-brand-600'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              disabled={!user}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                user
                  ? 'bg-slate-50 border-gray-200 dark:bg-slate-900 dark:border-slate-800 hover:border-rose-200 text-gray-700 dark:text-slate-300 hover:text-rose-500 cursor-pointer'
                  : 'bg-gray-50 border-gray-100 text-gray-400'
              } ${isLiked ? 'text-rose-500 border-rose-100 bg-rose-50/20' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount} Likes</span>
            </button>

            {user && (
              <button
                onClick={() => toggleBookmark(post._id)}
                className={`p-2 rounded-full border text-gray-700 dark:text-slate-300 transition-all cursor-pointer ${
                  isBookmarked(post._id)
                    ? 'border-brand-200 bg-brand-50/20 text-brand-500'
                    : 'bg-slate-50 border-gray-200 dark:bg-slate-900 dark:border-slate-800 hover:border-brand-200 hover:text-brand-500'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked(post._id) ? 'fill-brand-500' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl overflow-hidden shadow-sm aspect-video w-full bg-slate-100 dark:bg-slate-900">
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 font-light text-base sm:text-lg leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {post.images.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-slate-800">
            {post.images.slice(1).map((imgUrl, i) => (
              <a
                href={imgUrl}
                target="_blank"
                rel="noreferrer"
                key={i}
                className="aspect-video rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 block hover:shadow-md transition-shadow"
              >
                <img src={imgUrl} alt={`gallery-${i}`} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        )}
      </div>

      <CommentSection
        postId={post._id}
        initialComments={post.comments || []}
        postAuthorId={post.author?._id}
      />
    </article>
  );
};
export default BlogDetails;
