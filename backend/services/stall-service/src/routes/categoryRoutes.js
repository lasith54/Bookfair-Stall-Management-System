const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { createCategoryValidation, updateCategoryValidation } = require('../middleware/validation');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (Admin only)
router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  createCategoryValidation,
  categoryController.createCategory
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  updateCategoryValidation,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  categoryController.deleteCategory
);

module.exports = router;
