import { Request, Response } from 'express';
import Bookmark from '../models/Bookmark';
import Post from '../models/Post';
import { ApiResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { asyncHandler } from '../utils/async-handler';

export class BookmarksController {
  static addBookmark = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.body;
    const userId = (req.user as any)._id;

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      throw new ApiError(404, 'Post not found');
    }

    const existingBookmark = await Bookmark.findOne({ userId, postId });
    if (existingBookmark) {
      throw new ApiError(400, 'Post is already bookmarked');
    }

    const bookmark = new Bookmark({
      userId,
      postId,
    });

    await bookmark.save();

    return res.status(201).json(new ApiResponse(201, bookmark, 'Post bookmarked successfully'));
  });

  static removeBookmark = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = (req.user as any)._id;

    const bookmark = await Bookmark.findOneAndDelete({ userId, postId });
    if (!bookmark) {
      throw new ApiError(404, 'Bookmark not found');
    }

    return res.status(200).json(new ApiResponse(200, null, 'Bookmark removed successfully'));
  });

  static getBookmarks = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as any)._id;

    const bookmarks = await Bookmark.find({ userId })
      .populate({
        path: 'postId',
        populate: [
          { path: 'author', select: 'name email avatar bio role' },
          { path: 'destination', select: 'name state city coverImage' },
        ],
      })
      .sort({ createdAt: -1 });

    const bookmarkedPosts = bookmarks.map((b) => b.postId).filter(Boolean);

    return res.status(200).json(new ApiResponse(200, bookmarkedPosts, 'Bookmarks retrieved successfully'));
  });
}
export default BookmarksController;
