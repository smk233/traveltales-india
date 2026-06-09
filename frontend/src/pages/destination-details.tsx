import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, BookOpen } from 'lucide-react';
import axiosInstance from '../helpers/axios-instance';
import { Destination, Post } from '../types';
import PostCard from '../components/post-card';
import usePosts from '../hooks/usePosts';
import useBookmarks from '../hooks/useBookmarks';

import { useAuth } from '../hooks/useAuth';

export const DestinationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { likePost } = usePosts();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/destinations/${id}`);
        if (res.data.success) {
          setDestination(res.data.data.destination);
          setBlogs(res.data.data.posts);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load destination details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">{error || 'Destination Not Found'}</h1>
        <Link to="/destinations" className="text-brand-500 font-semibold flex items-center justify-center gap-2 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors">
      <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-900">
        <img
          src={destination.coverImage}
          alt={destination.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 max-w-7xl mx-auto text-white flex flex-col justify-end">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-1.5 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {destination.city}, {destination.state}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 leading-tight">{destination.name}</h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-100">
            <Calendar className="w-4 h-4" /> Best season to visit: {destination.bestSeason}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-3">About Destination</h3>
              <p className="text-sm text-gray-600 dark:text-slate-300 font-light leading-relaxed">
                {destination.description}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-1">
                📍 Location Coordinates
              </h3>
              <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-4 text-xs font-mono text-gray-500 dark:text-slate-400 space-y-1.5">
                <div>Latitude: <span className="font-bold text-brand-500">{destination.coordinates?.lat}</span></div>
                <div>Longitude: <span className="font-bold text-brand-500">{destination.coordinates?.lng}</span></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                Coordinates are integrated with geographic search APIs for route mappings.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-500" />
              Tales & Logs from {destination.name} ({blogs.length})
            </h3>

            {blogs.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed dark:border-slate-800">
                <p className="text-sm text-gray-500 dark:text-slate-400">No logs posted for this destination yet.</p>
                {user && (
                  <Link
                    to="/create-blog"
                    className="inline-block mt-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-sm"
                  >
                    Write the first tale!
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <PostCard
                    key={blog._id}
                    post={blog}
                    onLike={likePost}
                    isBookmarked={isBookmarked(blog._id)}
                    onBookmarkToggle={toggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DestinationDetails;
