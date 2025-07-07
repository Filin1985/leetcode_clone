import express from 'express';
import {
  getAllUsers,
  getUserProfile,
  updateUserRole,
  updateUserRating,
  deactivateUser,
} from '../controllers/users.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';
import { validateUserUpdate } from '../validators/users.ts';

const router = express.Router();

router.get('/', authenticate, authorize(["admin", "interviewer"]), getAllUsers);
router.get('/:id', authenticate, getUserProfile);

// Admin-only routes
router.put(
  '/:id/role',
  authenticate,
  authorize(["admin"]),
  validateUserUpdate,
  updateUserRole
);
router.put(
  '/:id/rating',
  authenticate,
  authorize(["admin", "interviewer"]),
  validateUserUpdate,
  updateUserRating
);
router.put(
  '/:id/deactivate',
  authenticate,
  authorize(["admin"]),
  deactivateUser
);

export default router;
