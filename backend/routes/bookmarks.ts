import { Router } from 'express';
import { body } from 'express-validator';
import BookmarksController from '../controllers/bookmarks-controller';
import { validateRequest } from '../middlewares/validation-middleware';
import { isAuthenticated } from '../middlewares/auth-middleware';

const router = Router();

router.get('/', isAuthenticated, BookmarksController.getBookmarks);

router.post(
  '/',
  isAuthenticated,
  [body('postId').notEmpty().withMessage('Post ID is required')],
  validateRequest,
  BookmarksController.addBookmark
);

router.delete('/:postId', isAuthenticated, BookmarksController.removeBookmark);

export default router;
