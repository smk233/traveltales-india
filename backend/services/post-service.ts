import Post, { IPost } from '../models/Post';
import { cachePostsHelper } from '../utils/cache-posts';
import mongoose from 'mongoose';

export class PostService {
  static async createPost(postData: Partial<IPost>): Promise<IPost> {
    const post = new Post(postData);
    await post.save();
    await cachePostsHelper.invalidateAllPostsCache();
    return post;
  }

  static async getHomeFeed(page = 1, limit = 10): Promise<IPost[]> {
    const cached = await cachePostsHelper.getCachedHomeFeed();
    if (cached) return cached;

    const posts = await Post.find()
      .populate('author', 'name email avatar bio role')
      .populate('destination', 'name state city coverImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    await cachePostsHelper.setCachedHomeFeed(posts);
    return posts;
  }

  static async getFeaturedPosts(): Promise<IPost[]> {
    const cached = await cachePostsHelper.getCachedFeaturedPosts();
    if (cached) return cached;

    const posts = await Post.find()
      .populate('author', 'name email avatar bio role')
      .populate('destination', 'name state city coverImage')
      .sort({ likes: -1, createdAt: -1 })
      .limit(5);

    await cachePostsHelper.setCachedFeaturedPosts(posts);
    return posts;
  }

  static async getTrendingBlogs(): Promise<IPost[]> {
    const cached = await cachePostsHelper.getCachedTrendingBlogs();
    if (cached) return cached;

    const posts = await Post.find()
      .populate('author', 'name email avatar bio role')
      .populate('destination', 'name state city coverImage')
      .sort({ comments: -1, likes: -1 })
      .limit(6);

    await cachePostsHelper.setCachedTrendingBlogs(posts);
    return posts;
  }

  static async getPostBySlug(slug: string): Promise<IPost | null> {
    return Post.findOne({ slug })
      .populate('author', 'name email avatar bio role followers following')
      .populate('destination', 'name state city coverImage description coordinates')
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'name email avatar role' },
      });
  }

  static async updatePost(id: string, authorId: string, updateData: Partial<IPost>): Promise<IPost | null> {
    const post = await Post.findOneAndUpdate(
      { _id: id, author: authorId },
      { $set: updateData },
      { new: true }
    );
    if (post) {
      await cachePostsHelper.invalidateAllPostsCache();
    }
    return post;
  }

  static async deletePost(id: string, authorId: string, isAdmin = false): Promise<boolean> {
    const query = isAdmin ? { _id: id } : { _id: id, author: authorId };
    const result = await Post.findOneAndDelete(query);
    if (result) {
      await cachePostsHelper.invalidateAllPostsCache();
      return true;
    }
    return false;
  }

  static async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');

    const uId = new mongoose.Types.ObjectId(userId);
    const index = post.likes.indexOf(uId);
    let liked = false;

    if (index === -1) {
      post.likes.push(uId);
      liked = true;
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    await cachePostsHelper.invalidateAllPostsCache();
    return { liked, likesCount: post.likes.length };
  }

  static async searchPosts(query: string): Promise<IPost[]> {
    const cached = await cachePostsHelper.getCachedSearchResults(query);
    if (cached) return cached;

    const regex = new RegExp(query, 'i');
    const posts = await Post.find({
      $or: [
        { title: regex },
        { description: regex },
        { content: regex },
        { state: regex },
        { city: regex },
        { tags: regex },
      ],
    })
      .populate('author', 'name email avatar bio role')
      .populate('destination', 'name state city coverImage')
      .sort({ createdAt: -1 });

    await cachePostsHelper.setCachedSearchResults(query, posts);
    return posts;
  }
}
export default PostService;
