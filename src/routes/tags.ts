import express from 'express';
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getProblemsByTag,
} from '../controllers/tags.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';
import { validateTag } from '../validators/tags.ts';

const router = express.Router();

// Public routes
router.get('/', getAllTags);
router.get('/:id/problems', getProblemsByTag);

// Protected routes (admin/interviewer only)
router.post(
  '/',
  authenticate,
  authorize(['admin', 'interviewer']),
  validateTag,
  createTag
);
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'interviewer']),
  validateTag,
  updateTag
);
router.delete(
  '/:id',
  authenticate,
  authorize(['admin', 'interviewer']),
  deleteTag
);

export default router;
