import express from 'express';
import { 
  submitSolution,
  getUserSolutions,
  getProblemSolutions
} from '../controllers/solutions.ts';
import { authenticate } from '../middlewares/auth.ts';

const router = express.Router();

router.post('/', authenticate, submitSolution);
router.get('/my', authenticate, getUserSolutions);
router.get('/problem/:problemId', authenticate, getProblemSolutions);

export default router;
