import { Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Destination from '../models/Destination';
import { ApiResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { asyncHandler } from '../utils/async-handler';
import mongoose from 'mongoose';

export class UsersController {
  static getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      throw new ApiError(400, 'Invalid user ID');
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const posts = await Post.find({ author: id })
      .populate('destination', 'name state city coverImage')
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, { user, posts }, 'User profile retrieved successfully'));
  });

  static toggleFollow = asyncHandler(async (req: Request, res: Response) => {
    const { id: followId } = req.params;
    const currentUserId = (req.user as any)._id;

    if (followId === currentUserId.toString()) {
      throw new ApiError(400, 'You cannot follow yourself');
    }

    const userToFollow = await User.findById(followId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      throw new ApiError(404, 'User not found');
    }

    const followObjId = new mongoose.Types.ObjectId(followId as string);
    const currentObjId = new mongoose.Types.ObjectId(currentUserId);

    const followingIndex = currentUser.following.indexOf(followObjId);
    let followed = false;

    if (followingIndex === -1) {
      currentUser.following.push(followObjId);
      userToFollow.followers.push(currentObjId);
      followed = true;
    } else {
      currentUser.following.splice(followingIndex, 1);
      const followerIndex = userToFollow.followers.indexOf(currentObjId);
      if (followerIndex !== -1) {
        userToFollow.followers.splice(followerIndex, 1);
      }
    }

    await currentUser.save();
    await userToFollow.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { followed, followersCount: userToFollow.followers.length, followingCount: currentUser.following.length },
          followed ? 'Followed user successfully' : 'Unfollowed user successfully'
        )
      );
  });

  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
  });

  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id as string);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await Post.deleteMany({ author: id });
    await Comment.deleteMany({ userId: id });

    return res.status(200).json(new ApiResponse(200, null, 'User and associated data deleted successfully'));
  });

  static getAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const commentCount = await Comment.countDocuments();
    const destinationCount = await Destination.countDocuments();

    const topDestinations = await Post.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'destinations',
          localField: '_id',
          foreignField: '_id',
          as: 'details',
        },
      },
      { $unwind: '$details' },
      {
        $project: {
          _id: 1,
          count: 1,
          name: '$details.name',
          state: '$details.state',
          city: '$details.city',
        },
      },
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          users: userCount,
          posts: postCount,
          comments: commentCount,
          destinations: destinationCount,
          topDestinations,
        },
        'Analytics retrieved successfully'
      )
    );
  });
}
export default UsersController;
