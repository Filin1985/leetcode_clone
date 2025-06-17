const express = require('express');
const router = express.Router();
const {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
} = require('../controllers/problems');
const { validateProblem } = require('../validators/problems');
const { authorize } = require('../middlewares/auth');

router.get('/', getAllProblems);
router.get('/:id', getProblemById);
router.post('/', authorize(['admin', 'interviewer']), validateProblem, createProblem);
router.put('/:id', authorize(['admin', 'interviewer']), validateProblem, updateProblem);
router.delete('/:id', authorize(['admin', 'interviewer']), deleteProblem);

module.exports = router;