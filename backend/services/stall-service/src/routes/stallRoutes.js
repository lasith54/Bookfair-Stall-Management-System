const express = require('express');
const router = express.Router();
const stallController = require('../controllers/stallController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { createStallValidation, updateStallValidation } = require('../middleware/validation');

// Public routes (anyone can view stalls)
router.get('/', stallController.getAllStalls);
router.get('/statistics', authenticate, authorizeRoles('admin', 'employee'), stallController.getStallStatistics);
router.get('/:id', stallController.getStallById);

// Protected routes (Admin/Employee only)
router.post(
  '/',
  authenticate,
  authorizeRoles('admin', 'employee'),
  createStallValidation,
  stallController.createStall
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('admin', 'employee'),
  updateStallValidation,
  stallController.updateStall
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  stallController.deleteStall
);

router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('admin', 'employee'),
  stallController.updateStallStatus
);

router.post(
  '/bulk-update',
  authenticate,
  authorizeRoles('admin'),
  stallController.bulkUpdateStalls
);

module.exports = router;
