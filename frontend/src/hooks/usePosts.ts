import { useState, useCallback } from 'react';
import axiosInstance from '../helpers/axios-instance';
import { Post } from '../types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featured, setFeatured] = useState<Post[]>([]);
  const [trending, setTrending] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHomeFeed = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/posts?page=${page}`);
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching home feed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/posts/featured');
      if (res.data.success) {
        setFeatured(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching featured posts', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/posts/trending');
      if (res.data.success) {
        setTrending(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching trending posts', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = async (formData: FormData): Promise<Post> => {
    const res = await axiosInstance.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  };

  const updatePost = async (id: string, formData: FormData): Promise<Post> => {
    const res = await axiosInstance.put(`/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  };

  const deletePost = async (id: string) => {
    await axiosInstance.delete(`/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const likePost = async (id: string): Promise<{ liked: boolean; likesCount: number } | null> => {
    try {
      const res = await axiosInstance.post(`/posts/${id}/like`);
      if (res.data.success) {
        const result = res.data.data;
        setPosts((prev) =>
          prev.map((p) => {
            if (p._id === id) {
              return {
                ...p,
                likes: result.liked
                  ? [...p.likes, 'currentUserPlaceholder']
                  : p.likes.slice(0, -1),
              };
            }
            return p;
          })
        );
        return result;
      }
      return null;
    } catch (err) {
      console.error('Error liking post', err);
      return null;
    }
  };

  return {
    posts,
    featured,
    trending,
    loading,
    fetchHomeFeed,
    fetchFeatured,
    fetchTrending,
    createPost,
    updatePost,
    deletePost,
    likePost,
  };
};
export default usePosts;
