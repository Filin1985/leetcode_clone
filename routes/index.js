const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const problemRoutes = require('./problems');
const solutionRoutes = require('./solutions');
const commentRoutes = require('./comments');
const tagRoutes = require('./tags');
const materialRoutes = require('./materials');
const userRoutes = require('./users');
const { authenticate, authorize } = require('../middlewares/auth');

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/problems', authenticate, problemRoutes);
router.use('/solutions', authenticate, solutionRoutes);
router.use('/comments', authenticate, commentRoutes);
router.use('/tags', authenticate, tagRoutes);
router.use('/materials', authenticate, materialRoutes);
router.use('/users', authenticate, authorize(['admin', 'interviewer']), userRoutes);

module.exports = router;