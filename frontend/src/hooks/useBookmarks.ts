import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../helpers/axios-instance';
import { Post } from '../types';
import { useAuth } from './useAuth';

export const useBookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.get('/bookmarks');
      if (res.data.success) {
        setBookmarks(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch bookmarks', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const toggleBookmark = async (postId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const alreadyBookmarked = bookmarks.some((p) => p._id === postId);
      if (alreadyBookmarked) {
        const res = await axiosInstance.delete(`/bookmarks/${postId}`);
        if (res.data.success) {
          setBookmarks((prev) => prev.filter((p) => p._id !== postId));
          return false;
        }
      } else {
        const res = await axiosInstance.post('/bookmarks', { postId });
        if (res.data.success) {
          await fetchBookmarks();
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Bookmark toggle failed', err);
      return false;
    }
  };

  const isBookmarked = useCallback(
    (postId: string): boolean => {
      return bookmarks.some((p) => p._id === postId);
    },
    [bookmarks]
  );

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return { bookmarks, loading, toggleBookmark, isBookmarked, refetchBookmarks: fetchBookmarks };
};
export default useBookmarks;
