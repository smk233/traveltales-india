import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, MapPin, Calendar, Bookmark } from 'lucide-react';
import { Post } from '../types';
import { useAuth } from '../hooks/useAuth';

interface PostCardProps {
  post: Post;
  onLike?: (id: string) => Promise<any>;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string) => Promise<boolean>;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  isBookmarked = false,
  onBookmarkToggle,
}) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(() => {
    return user ? post.likes.includes(user._id) : false;
  });
  const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !onLike) return;
    try {
      const res = await onLike(post._id);
      if (res) {
        setIsLiked(res.liked);
        setLikesCount(res.likesCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !onBookmarkToggle) return;
    try {
      const newState = await onBookmarkToggle(post._id);
      setIsBookmarkedState(newState);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group h-full">
      <div className="relative h-48 sm:h-52 overflow-hidden shrink-0">
        <img
          src={post.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
          <MapPin className="w-3 h-3 text-brand-500" />
          {post.state}
        </div>

        {user && onBookmarkToggle && (
          <button
            onClick={handleBookmark}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-slate-900 text-gray-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-500 transition-all cursor-pointer"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarkedState ? 'fill-brand-500 text-brand-500' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-[10px] text-gray-400 dark:text-slate-400 font-semibold mb-2 uppercase flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>

          <Link
            to={`/blog/${post.slug}`}
            className="block text-lg font-bold text-gray-900 dark:text-slate-100 hover:text-brand-500 dark:hover:text-brand-500 transition-colors line-clamp-1 mb-2"
          >
            {post.title}
          </Link>

          <p className="text-gray-500 dark:text-slate-300 text-xs font-light line-clamp-2 leading-relaxed mb-4">
            {post.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700/60 pt-4 mt-auto">
          <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-2 group/author">
            <img
              src={post.author?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder'}
              alt={post.author?.name}
              className="w-7 h-7 rounded-full border border-gray-100 object-cover"
            />
            <span className="text-[11px] font-bold text-gray-700 dark:text-slate-300 group-hover/author:text-brand-500 transition-colors">
              {post.author?.name.split(' ')[0]}
            </span>
          </Link>

          <div className="flex items-center gap-2.5 text-xs text-gray-400 dark:text-slate-400">
            <button
              onClick={handleLike}
              disabled={!user}
              className={`flex items-center gap-1 transition-all ${
                user ? 'hover:text-rose-500 cursor-pointer' : ''
              } ${isLiked ? 'text-rose-500 font-semibold' : ''}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              {likesCount}
            </button>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              {post.comments?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
