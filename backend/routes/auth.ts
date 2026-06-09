import { Router } from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/auth-controller';
import { validateRequest } from '../middlewares/validation-middleware';
import { isAuthenticated } from '../middlewares/auth-middleware';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  validateRequest,
  AuthController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  AuthController.login
);

router.post('/logout', AuthController.logout);

router.get('/me', isAuthenticated, AuthController.getMe);

export default router;
