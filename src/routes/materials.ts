// routes/materials.js
import express from 'express';
import {
  getAllMaterials,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial
} from '../controllers/materials.js';
import { authenticate } from '../middlewares/auth.ts';
import { validateMaterial } from '../validators/materials.ts';

const router = express.Router();

router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.post('/', authenticate, validateMaterial, createMaterial);
router.put('/:id', authenticate, validateMaterial, updateMaterial);
router.delete('/:id', authenticate, deleteMaterial);

export default router;
