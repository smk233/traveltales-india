import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Post from '../models/Post';
import { ApiResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { asyncHandler } from '../utils/async-handler';
import { cachePostsHelper } from '../utils/cache-posts';

export class CommentsController {
  static addComment = asyncHandler(async (req: Request, res: Response) => {
    const { postId, text } = req.body;
    const userId = (req.user as any)._id;

    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    const comment = new Comment({
      postId,
      userId,
      text,
    });

    await comment.save();

    post.comments.push(comment._id as any);
    await post.save();

    await cachePostsHelper.invalidateAllPostsCache();

    const populated = await Comment.findById(comment._id).populate('userId', 'name email avatar role');

    return res.status(201).json(new ApiResponse(201, populated, 'Comment added successfully'));
  });

  static deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req.user as any)._id;
    const role = (req.user as any).role;

    const comment = await Comment.findById(id);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    const post = await Post.findById(comment.postId);
    const isCommentOwner = comment.userId.toString() === userId.toString();
    const isPostOwner = post ? post.author.toString() === userId.toString() : false;
    const isAdmin = role === 'admin';

    if (!isCommentOwner && !isPostOwner && !isAdmin) {
      throw new ApiError(403, 'Unauthorized to delete this comment');
    }

    await Comment.findByIdAndDelete(id);

    if (post) {
      post.comments = post.comments.filter((cId) => cId.toString() !== id);
      await post.save();
    }

    await cachePostsHelper.invalidateAllPostsCache();

    return res.status(200).json(new ApiResponse(200, null, 'Comment deleted successfully'));
  });
}
export default CommentsController;
