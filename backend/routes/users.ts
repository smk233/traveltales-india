import { Router } from 'express';
import UsersController from '../controllers/users-controller';
import { isAuthenticated, isAdmin } from '../middlewares/auth-middleware';

const router = Router();

// Admin operations (need to go first to avoid :id collisions)
router.get('/analytics', isAuthenticated, isAdmin, UsersController.getAnalytics);
router.get('/all', isAuthenticated, isAdmin, UsersController.getAllUsers);

router.get('/:id', UsersController.getUserProfile);
router.post('/:id/follow', isAuthenticated, UsersController.toggleFollow);
router.delete('/:id', isAuthenticated, isAdmin, UsersController.deleteUser);

export default router;
