import express from 'express';
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getProblemsByTag,
} from '../controllers/tags.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateTag } from '../validators/tags.js';

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
