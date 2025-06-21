import express from 'express';
import {
  getAllUsers,
  getUserProfile,
  updateUserRole,
  updateUserRating,
  deactivateUser,
} from '../controllers/users.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateUserUpdate } from '../validators/users.js';

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
