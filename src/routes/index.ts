import express from 'express';
import problemRoutes from './problems.js';
import solutionRoutes from './solutions.js';
import commentRoutes from './comments.js';
import tagRoutes from './tags.js';
import materialRoutes from './materials.js';
import userRoutes from './users.js';
import authRoutes from './auth.js';
import {authenticate, authorize} from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/problems', problemRoutes);
router.use('/solutions', authenticate, solutionRoutes);
router.use('/comments', authenticate, commentRoutes);
router.use('/tags', authenticate, tagRoutes);
router.use('/materials', authenticate, materialRoutes);
router.use('/users', authenticate, authorize(['admin', 'interviewer']), userRoutes);

export default router;
