import express from 'express';
import { 
  submitSolution,
  getUserSolutions,
  getProblemSolutions
} from '../controllers/solutions.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, submitSolution);
router.get('/my', authenticate, getUserSolutions);
router.get('/problem/:problemId', authenticate, getProblemSolutions);

export default router;
