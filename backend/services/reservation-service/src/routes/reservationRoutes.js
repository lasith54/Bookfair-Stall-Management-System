const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate } = require('../middleware/auth');
const { checkAvailability } = require('../middleware/checkAvailability');
const {
  createReservationValidation,
  cancelReservationValidation,
  checkAvailabilityValidation
} = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Create reservation
router.post(
  '/',
  createReservationValidation,
  checkAvailability,
  reservationController.createReservation
);

// Get my reservations
router.get('/my-reservations', reservationController.getMyReservations);

// Check availability
router.post(
  '/check-availability',
  checkAvailabilityValidation,
  reservationController.checkAvailability
);

// Get reservation by ID
router.get('/:id', reservationController.getReservationById);

// Cancel reservation
router.post(
  '/:id/cancel',
  cancelReservationValidation,
  reservationController.cancelReservation
);

module.exports = router;
