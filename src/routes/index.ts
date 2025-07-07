import express from 'express';
import problemRoutes from './problems.ts';
import solutionRoutes from './solutions.ts';
import commentRoutes from './comments.ts';
import tagRoutes from './tags.ts';
import materialRoutes from './materials.ts';
import userRoutes from './users.ts';
import authRoutes from './auth.ts';
import {authenticate, authorize} from '../middlewares/auth.ts';

const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/problems', authenticate, problemRoutes);
router.use('/solutions', authenticate, solutionRoutes);
router.use('/comments', authenticate, commentRoutes);
router.use('/tags', authenticate, tagRoutes);
router.use('/materials', authenticate, materialRoutes);
router.use('/users', authenticate, authorize(['admin', 'interviewer']), userRoutes);

export default router;
