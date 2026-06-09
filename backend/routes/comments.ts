import { Router } from 'express';
import { body } from 'express-validator';
import CommentsController from '../controllers/comments-controller';
import { validateRequest } from '../middlewares/validation-middleware';
import { isAuthenticated } from '../middlewares/auth-middleware';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  [
    body('postId').notEmpty().withMessage('Post ID is required'),
    body('text').notEmpty().withMessage('Comment text is required').trim(),
  ],
  validateRequest,
  CommentsController.addComment
);

router.delete('/:id', isAuthenticated, CommentsController.deleteComment);

export default router;
