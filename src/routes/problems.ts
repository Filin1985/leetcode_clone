import express from 'express';
import {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
} from '../controllers/problems.js';
import { validateProblem } from '../validators/problems.js';
import { authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllProblems);
router.get('/:id', getProblemById);
router.post('/', authorize(['admin', 'interviewer']), validateProblem, createProblem);
router.put('/:id', authorize(['admin', 'interviewer']), validateProblem, updateProblem);
router.delete('/:id', authorize(['admin', 'interviewer']), deleteProblem);

export default router;
