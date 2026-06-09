import { Router } from 'express';
import { body } from 'express-validator';
import PostsController from '../controllers/posts-controller';
import { validateRequest } from '../middlewares/validation-middleware';
import { isAuthenticated } from '../middlewares/auth-middleware';
import { upload, generatePostSlug } from '../middlewares/post-middleware';

const router = Router();

router.get('/', PostsController.getPosts);
router.get('/featured', PostsController.getFeatured);
router.get('/trending', PostsController.getTrending);
router.get('/search', PostsController.search);
router.get('/slug/:slug', PostsController.getPostBySlug);

router.post(
  '/',
  isAuthenticated,
  upload.array('images', 5),
  generatePostSlug,
  [
    body('title').notEmpty().withMessage('Title is required').trim(),
    body('description').notEmpty().withMessage('Description is required').trim(),
    body('content').notEmpty().withMessage('Content is required').trim(),
    body('destinationId').notEmpty().withMessage('Destination is required'),
  ],
  validateRequest,
  PostsController.createPost
);

router.put(
  '/:id',
  isAuthenticated,
  upload.array('images', 5),
  PostsController.updatePost
);

router.delete('/:id', isAuthenticated, PostsController.deletePost);

router.post('/:id/like', isAuthenticated, PostsController.toggleLike);

export default router;
