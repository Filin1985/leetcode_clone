import express from 'express';
import {
  createComment,
  getProblemComments,
  updateComment,
  deleteComment,
} from '../controllers/comments.js';
import { authenticate } from '../middlewares/auth.js';
import { validateComment } from '../validators/comments.js';

const router = express.Router();

// Create a new comment
router.post('/', authenticate, validateComment, createComment);

// Get all comments for a problem
router.get('/problem/:problemId', authenticate, getProblemComments);

// Update a comment
router.put('/:id', authenticate, validateComment, updateComment);

// Delete a comment
router.delete('/:id', authenticate, deleteComment);

export default router;
