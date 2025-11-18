const express = require('express');
const router = express.Router();
const adminReservationController = require('../controllers/adminReservationController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const {
  approveReservationValidation,
  rejectReservationValidation,
  updateReservationValidation
} = require('../middleware/validation');

// All routes require authentication and admin/employee role
router.use(authenticate);
router.use(authorizeRoles('admin', 'employee'));

// Get all reservations
router.get('/all', adminReservationController.getAllReservations);

// Get reservation by ID
router.get('/:id', adminReservationController.getReservationById);

// Approve reservation
router.post(
  '/:id/approve',
  approveReservationValidation,
  adminReservationController.approveReservation
);

// Reject reservation
router.post(
  '/:id/reject',
  rejectReservationValidation,
  adminReservationController.rejectReservation
);

// Confirm reservation
router.post('/:id/confirm', adminReservationController.confirmReservation);

// Update reservation
router.put(
  '/:id',
  updateReservationValidation,
  adminReservationController.updateReservation
);

// Generate report
router.get('/reports/generate', adminReservationController.generateReport);

module.exports = router;
