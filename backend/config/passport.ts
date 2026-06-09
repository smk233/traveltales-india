import passport from 'passport';
import { Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import { Request } from 'express';
import User from '../models/User';
import { config } from './utils';

const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: config.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload: { id: string }, done: VerifiedCallback) => {
    try {
      const user = await User.findById(jwtPayload.id).select('-password');
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
