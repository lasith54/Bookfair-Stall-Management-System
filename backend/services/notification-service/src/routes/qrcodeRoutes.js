const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getMyQRCode,
  generateQRCodeForReservation,
  regenerateQRCodeForReservation,
  verifyQRCodeData,
} = require('../controllers/qrcodeController');
const {
  validateQRCodeGeneration,
  validateQRCodeVerification,
} = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Get QR code for reservation
router.get('/reservation/:reservationId', validateQRCodeGeneration, getMyQRCode);

// Generate QR code for reservation
router.post('/generate/:reservationId', validateQRCodeGeneration, generateQRCodeForReservation);

// Regenerate QR code
router.post('/regenerate/:reservationId', validateQRCodeGeneration, regenerateQRCodeForReservation);

// Verify QR code
router.post('/verify', validateQRCodeVerification, verifyQRCodeData);

module.exports = router;
