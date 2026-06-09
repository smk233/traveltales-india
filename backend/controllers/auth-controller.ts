import { Request, Response } from 'express';
import User from '../models/User';
import { AuthService } from '../services/auth-service';
import { ApiResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { asyncHandler } from '../utils/async-handler';
import { cookieOptions } from '../utils/cookie-options';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, bio } = req.body;

    const existingUser = await AuthService.findUserByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    const role = (await User.countDocuments()) === 0 ? 'admin' : 'user';

    const newUser = new User({
      name,
      email,
      password,
      bio: bio || '',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      role,
    });

    await newUser.save();
    const userResponse = await User.findById(newUser._id).select('-password');

    return res
      .status(201)
      .json(new ApiResponse(201, userResponse, 'User registered successfully'));
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = AuthService.generateToken(user._id.toString());
    const userResponse = await User.findById(user._id).select('-password');

    return res
      .status(200)
      .cookie('token', token, cookieOptions)
      .json(new ApiResponse(200, { user: userResponse, token }, 'Logged in successfully'));
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    return res
      .status(200)
      .clearCookie('token', cookieOptions)
      .json(new ApiResponse(200, null, 'Logged out successfully'));
  });

  static getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, 'Not authenticated');
    }
    return res.status(200).json(new ApiResponse(200, user, 'User profile fetched successfully'));
  });
}
export default AuthController;
