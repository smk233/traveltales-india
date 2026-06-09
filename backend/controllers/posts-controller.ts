import { Request, Response } from 'express';
import PostService from '../services/post-service';
import Destination from '../models/Destination';
import { ApiResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { asyncHandler } from '../utils/async-handler';

export class PostsController {
  static createPost = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, content, destinationId, tags, slug } = req.body;
    const authorId = (req.user as any)._id;

    const destinationObj = await Destination.findById(destinationId);
    if (!destinationObj) {
      throw new ApiError(404, 'Destination not found');
    }

    let imagesList: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imagesList = (req.files as Express.Multer.File[]).map(
        (file) => `/uploads/${file.filename}`
      );
    } else if (req.body.images) {
      imagesList = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const post = await PostService.createPost({
      title,
      slug,
      description,
      content,
      images: imagesList,
      destination: destinationId,
      state: destinationObj.state,
      city: destinationObj.city,
      author: authorId,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim())) : [],
    });

    return res.status(201).json(new ApiResponse(201, post, 'Post created successfully'));
  });

  static getPosts = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '10', 10);
    const posts = await PostService.getHomeFeed(page, limit);
    return res.status(200).json(new ApiResponse(200, posts, 'Posts retrieved successfully'));
  });

  static getFeatured = asyncHandler(async (req: Request, res: Response) => {
    const posts = await PostService.getFeaturedPosts();
    return res.status(200).json(new ApiResponse(200, posts, 'Featured posts retrieved successfully'));
  });

  static getTrending = asyncHandler(async (req: Request, res: Response) => {
    const posts = await PostService.getTrendingBlogs();
    return res.status(200).json(new ApiResponse(200, posts, 'Trending posts retrieved successfully'));
  });

  static getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const post = await PostService.getPostBySlug(slug as string);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    return res.status(200).json(new ApiResponse(200, post, 'Post details retrieved successfully'));
  });

  static updatePost = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authorId = (req.user as any)._id;
    const { title, description, content, tags } = req.body;

    let updateFields: any = { title, description, content };
    if (tags) {
      updateFields.tags = Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim());
    }

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      updateFields.images = (req.files as Express.Multer.File[]).map(
        (file) => `/uploads/${file.filename}`
      );
    }

    const post = await PostService.updatePost(id as string, authorId.toString(), updateFields);
    if (!post) {
      throw new ApiError(404, 'Post not found or you are not authorized to update it');
    }

    return res.status(200).json(new ApiResponse(200, post, 'Post updated successfully'));
  });

  static deletePost = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authorId = (req.user as any)._id;
    const role = (req.user as any).role;

    const isDeleted = await PostService.deletePost(id as string, authorId.toString(), role === 'admin');
    if (!isDeleted) {
      throw new ApiError(404, 'Post not found or you are not authorized to delete it');
    }

    return res.status(200).json(new ApiResponse(200, null, 'Post deleted successfully'));
  });

  static toggleLike = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req.user as any)._id;

    const result = await PostService.toggleLike(id as string, userId.toString());
    return res.status(200).json(new ApiResponse(200, result, result.liked ? 'Post liked' : 'Post unliked'));
  });

  static search = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string || '';
    if (!query) {
      throw new ApiError(400, 'Search query is required');
    }
    const posts = await PostService.searchPosts(query);
    return res.status(200).json(new ApiResponse(200, posts, `Search results for query: ${query}`));
  });
}
export default PostsController;
