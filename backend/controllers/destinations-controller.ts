import { Request, Response } from 'express';
import Destination from '../models/Destination';
import Post from '../models/Post';
import { ApiResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { asyncHandler } from '../utils/async-handler';
import { cachePostsHelper } from '../utils/cache-posts';

export class DestinationsController {
  static createDestination = asyncHandler(async (req: Request, res: Response) => {
    const { name, state, city, coverImage, description, bestSeason, coordinates } = req.body;

    const existing = await Destination.findOne({ name });
    if (existing) {
      throw new ApiError(400, 'Destination already exists');
    }

    const destination = new Destination({
      name,
      state,
      city,
      coverImage,
      description,
      bestSeason,
      coordinates,
    });

    await destination.save();
    await cachePostsHelper.invalidateDestinations();

    return res
      .status(201)
      .json(new ApiResponse(201, destination, 'Destination created successfully'));
  });

  static getDestinations = asyncHandler(async (req: Request, res: Response) => {
    const cached = await cachePostsHelper.getCachedDestinations();
    if (cached) {
      return res.status(200).json(new ApiResponse(200, cached, 'Destinations retrieved successfully (cached)'));
    }

    const destinations = await Destination.find().sort({ name: 1 });
    await cachePostsHelper.setCachedDestinations(destinations);

    return res
      .status(200)
      .json(new ApiResponse(200, destinations, 'Destinations retrieved successfully'));
  });

  static getDestinationById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const destination = await Destination.findById(id);
    if (!destination) {
      throw new ApiError(404, 'Destination not found');
    }

    const posts = await Post.find({ destination: id })
      .populate('author', 'name email avatar bio')
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, { destination, posts }, 'Destination details retrieved successfully'));
  });

  static deleteDestination = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const destination = await Destination.findByIdAndDelete(id);
    if (!destination) {
      throw new ApiError(404, 'Destination not found');
    }

    await cachePostsHelper.invalidateDestinations();

    return res.status(200).json(new ApiResponse(200, null, 'Destination deleted successfully'));
  });
}
export default DestinationsController;
