import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';

import './config/passport';

import authRouter from './routes/auth';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
import usersRouter from './routes/users';
import bookmarksRouter from './routes/bookmarks';
import destinationsRouter from './routes/destinations';

import { errorHandler } from './middlewares/error-middleware';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/destinations', destinationsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TravelTales India API is healthy' });
});

app.use(errorHandler);

export default app;
