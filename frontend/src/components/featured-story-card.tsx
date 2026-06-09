import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Calendar } from 'lucide-react';
import { Post } from '../types';

interface FeaturedStoryCardProps {
  post: Post;
}

export const FeaturedStoryCard: React.FC<FeaturedStoryCardProps> = ({ post }) => {
  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-700/80 transition-all duration-300 hover:shadow-xl group flex flex-col lg:flex-row">
      <div className="relative w-full lg:w-3/5 h-64 lg:h-96 overflow-hidden">
        <img
          src={post.images[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          Featured Story
        </div>
      </div>

      <div className="flex flex-col justify-between p-6 sm:p-8 w-full lg:w-2/5">
        <div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase">
              {post.destination?.name || post.city}
            </span>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="block text-2xl font-bold text-gray-900 dark:text-slate-100 hover:text-brand-500 dark:hover:text-brand-500 transition-colors mb-3 leading-tight"
          >
            {post.title}
          </Link>

          <p className="text-gray-600 dark:text-slate-300 text-sm line-clamp-3 mb-6 font-light">
            {post.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700/60 pt-4 mt-auto">
          <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-2.5 group/author">
            <img
              src={post.author?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder'}
              alt={post.author?.name}
              className="w-9 h-9 rounded-full border border-gray-100"
            />
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-slate-200 group-hover/author:text-brand-500 transition-colors">
                {post.author?.name}
              </p>
              <p className="text-[10px] text-gray-500">Creator</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-rose-500" />
              {post.likes.length}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              {post.comments.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FeaturedStoryCard;
