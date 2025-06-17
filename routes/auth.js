const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/auth');
const { validateRegister, validateLogin } = require('../validators/auth');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

module.exports = router;