const express = require('express');
const { register, login, logout } = require('../controllers/authController');

const router = express.Router();
const authMiddleware = require('../authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

module.exports = router;