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
  // Admin endpoints
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  toggleUserVerification,
  getUserStats,
  resetUserPassword,
  bulkUpdateUsers,
  exportUsers,
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

// Admin routes (require authentication)
router.get('/admin/users', authMiddleware, getAllUsers);
router.get('/admin/users/stats', authMiddleware, getUserStats);
router.get('/admin/users/export', authMiddleware, exportUsers);
router.get('/admin/users/:userId', authMiddleware, getUserById);
router.post('/admin/users', authMiddleware, createUser);
router.put('/admin/users/:userId', authMiddleware, updateUser);
router.delete('/admin/users/:userId', authMiddleware, deleteUser);
router.patch('/admin/users/:userId/status', authMiddleware, toggleUserStatus);
router.patch('/admin/users/:userId/verification', authMiddleware, toggleUserVerification);
router.patch('/admin/users/:userId/password', authMiddleware, resetUserPassword);
router.patch('/admin/users/bulk', authMiddleware, bulkUpdateUsers);

module.exports = router;
