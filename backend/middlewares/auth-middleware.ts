import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ApiError } from '../utils/api-error';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new ApiError(401, 'Unauthorized access, please login'));
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user as any).role !== 'admin') {
    return next(new ApiError(403, 'Forbidden, admin privileges required'));
  }
  next();
};
