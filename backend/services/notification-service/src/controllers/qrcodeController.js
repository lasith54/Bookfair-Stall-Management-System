const QRCode = require('../models/QRCode');
const axios = require('axios');
const {
  generateQRCode,
  verifyQRCode,
  scanQRCode,
  regenerateQRCode,
} = require('../services/qrcodeService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Get QR code for user's reservation
 */
const getMyQRCode = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.user.userId;

    const qrCode = await QRCode.findOne({
      reservation: reservationId,
      user: userId,
    });

    if (!qrCode) {
      return errorResponse(res, 'QR code not found for this reservation', 404);
    }

    if (!qrCode.isValid) {
      return errorResponse(res, 'QR code is no longer valid', 400);
    }

    if (qrCode.isExpired()) {
      return errorResponse(res, 'QR code has expired', 400);
    }

    return successResponse(res, qrCode, 'QR code retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Generate new QR code for reservation
 */
const generateQRCodeForReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.user.userId;

    // Fetch reservation from reservation service
    const reservationResponse = await axios.get(
      `${process.env.RESERVATION_SERVICE_URL}/api/reservations/${reservationId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    const reservation = reservationResponse.data.data;

    // Verify user owns this reservation
    if (reservation.user._id !== userId && reservation.user !== userId) {
      return errorResponse(res, 'Unauthorized access to this reservation', 403);
    }

    // Only generate QR code for confirmed reservations
    if (reservation.status !== 'CONFIRMED') {
      return errorResponse(
        res,
        'QR code can only be generated for confirmed reservations',
        400
      );
    }

    // Generate QR code
    const qrCode = await generateQRCode(
      reservation,
      { _id: userId, email: req.user.email }
    );

    return successResponse(res, qrCode, 'QR code generated successfully', 201);
  } catch (error) {
    if (error.response) {
      return errorResponse(res, error.response.data.message || 'Failed to fetch reservation', error.response.status);
    }
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Regenerate QR code
 */
const regenerateQRCodeForReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.user.userId;

    // Fetch reservation from reservation service
    const reservationResponse = await axios.get(
      `${process.env.RESERVATION_SERVICE_URL}/api/reservations/${reservationId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    const reservation = reservationResponse.data.data;

    // Verify user owns this reservation
    if (reservation.user._id !== userId && reservation.user !== userId) {
      return errorResponse(res, 'Unauthorized access to this reservation', 403);
    }

    // Only regenerate for confirmed reservations
    if (reservation.status !== 'CONFIRMED') {
      return errorResponse(
        res,
        'QR code can only be regenerated for confirmed reservations',
        400
      );
    }

    // Regenerate QR code
    const qrCode = await regenerateQRCode(
      reservation,
      { _id: userId, email: req.user.email }
    );

    return successResponse(res, qrCode, 'QR code regenerated successfully');
  } catch (error) {
    if (error.response) {
      return errorResponse(res, error.response.data.message || 'Failed to fetch reservation', error.response.status);
    }
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Verify QR code (public endpoint for scanning)
 */
const verifyQRCodeData = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return errorResponse(res, 'QR code data is required', 400);
    }

    const verification = await verifyQRCode(qrData);

    return successResponse(res, verification, 'QR code verified');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Scan QR code (admin only)
 */
const scanQRCodeData = async (req, res) => {
  try {
    const { qrData, location, deviceInfo } = req.body;
    const scannedBy = req.user.userId;

    if (!qrData) {
      return errorResponse(res, 'QR code data is required', 400);
    }

    const scanResult = await scanQRCode(qrData, scannedBy, location, deviceInfo);

    if (!scanResult.success) {
      return errorResponse(res, scanResult.message, 400);
    }

    return successResponse(res, scanResult, 'QR code scanned successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get QR code scan history (admin only)
 */
const getQRCodeScanHistory = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const qrCode = await QRCode.findOne({ reservation: reservationId });

    if (!qrCode) {
      return errorResponse(res, 'QR code not found', 404);
    }

    return successResponse(res, {
      qrCode: {
        reservation: qrCode.reservation,
        user: qrCode.user,
        isScanned: qrCode.isScanned,
        scannedAt: qrCode.scannedAt,
        scannedBy: qrCode.scannedBy,
        scanCount: qrCode.scanCount,
        isValid: qrCode.isValid,
      },
      scanHistory: qrCode.scanHistory,
    }, 'QR code scan history retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get all scanned QR codes (admin only)
 */
const getAllScannedQRCodes = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const qrCodes = await QRCode.find({ isScanned: true })
      .sort({ scannedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await QRCode.countDocuments({ isScanned: true });

    return successResponse(res, {
      qrCodes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    }, 'Scanned QR codes retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getMyQRCode,
  generateQRCodeForReservation,
  regenerateQRCodeForReservation,
  verifyQRCodeData,
  scanQRCodeData,
  getQRCodeScanHistory,
  getAllScannedQRCodes,
};
