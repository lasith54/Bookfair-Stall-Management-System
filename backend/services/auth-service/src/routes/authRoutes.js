const express = require('express');
const router = express.Router();
const {
  register,
  login,
  employeeLogin,
  refresh,
  logout,
  verify,
  getProfile,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  validate,
} = require('../middleware/validation');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/employee/login', loginValidation, validate, employeeLogin);
router.post('/refresh', refreshTokenValidation, validate, refresh);
router.post('/logout', logout);

// Protected routes
router.get('/verify', authMiddleware, verify);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
