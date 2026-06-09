import { Router } from 'express';
import { body } from 'express-validator';
import DestinationsController from '../controllers/destinations-controller';
import { validateRequest } from '../middlewares/validation-middleware';
import { isAuthenticated, isAdmin } from '../middlewares/auth-middleware';

const router = Router();

router.get('/', DestinationsController.getDestinations);
router.get('/:id', DestinationsController.getDestinationById);

router.post(
  '/',
  isAuthenticated,
  isAdmin,
  [
    body('name').notEmpty().withMessage('Destination name is required').trim(),
    body('state').notEmpty().withMessage('State is required').trim(),
    body('city').notEmpty().withMessage('City is required').trim(),
    body('coverImage').notEmpty().withMessage('Cover image URL is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('bestSeason').notEmpty().withMessage('Best season is required'),
    body('coordinates.lat').isNumeric().withMessage('Latitude must be a number'),
    body('coordinates.lng').isNumeric().withMessage('Longitude must be a number'),
  ],
  validateRequest,
  DestinationsController.createDestination
);

router.delete('/:id', isAuthenticated, isAdmin, DestinationsController.deleteDestination);

export default router;
