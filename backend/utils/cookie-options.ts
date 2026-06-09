import { CookieOptions } from 'express';
import { config } from '../config/utils';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
