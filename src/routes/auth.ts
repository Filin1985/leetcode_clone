import express from 'express';
import { register, login, logout } from '../controllers/auth.js';
import { validateRegister, validateLogin } from '../validators/auth.ts';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

export default router;