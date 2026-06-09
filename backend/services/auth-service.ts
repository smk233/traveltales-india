import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { config } from '../config/utils';

export class AuthService {
  static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  static async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  static async findUserById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password');
  }
}
