const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  scanQRCodeData,
  getQRCodeScanHistory,
  getAllScannedQRCodes,
} = require('../controllers/qrcodeController');
const {
  validateQRCodeScan,
  validateQRCodeGeneration,
  validateNotificationQuery,
} = require('../middleware/validation');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRole('ADMIN'));

// Scan QR code
router.post('/scan', validateQRCodeScan, scanQRCodeData);

// Get QR code scan history
router.get('/scan-history/:reservationId', validateQRCodeGeneration, getQRCodeScanHistory);

// Get all scanned QR codes
router.get('/scanned', validateNotificationQuery, getAllScannedQRCodes);

module.exports = router;
