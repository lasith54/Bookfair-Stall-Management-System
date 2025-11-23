const QRCode = require('qrcode');
const qrConfig = require('../config/qrcode');
const QRCodeModel = require('../models/QRCode');
const { encrypt, decrypt, generateHash } = require('../utils/encryption');

/**
 * Generate QR code for reservation
 */
const generateQRCode = async (reservation, user) => {
  try {
    // Check if QR code already exists
    let existingQR = await QRCodeModel.findOne({ reservation: reservation._id });
    
    if (existingQR && existingQR.isValid && !existingQR.isExpired()) {
      return existingQR;
    }

    // Prepare QR code data
    const qrData = {
      reservationId: reservation._id.toString(),
      reservationNumber: reservation.reservationNumber,
      generatedAt: new Date().toISOString(),
      hash: '',
    };

    // Generate hash for data integrity
    qrData.hash = generateHash(qrData);

    // Encrypt data
    const encryptedData = encrypt(qrData);
    
    console.log(`Generated encrypted QR data: ${encryptedData.substring(0, 100)}...`);
    console.log(`Encrypted data length: ${encryptedData.length}`);

    // Generate QR code image (base64)
    const qrCodeImage = await QRCode.toDataURL(encryptedData, qrConfig.options);
    
    console.log(`QR code generated for reservation ${qrData.reservationNumber}, contains encrypted data`);

    // Calculate expiry (reservation end date + 7 days)
    const expiresAt = new Date(reservation.endDate);
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create or update QR code record
    if (existingQR) {
      existingQR.qrCodeData = encryptedData;
      existingQR.encryptedData = encryptedData;
      existingQR.qrCodeImage = qrCodeImage;
      existingQR.metadata = {
        reservationNumber: reservation.reservationNumber,
        stallName: qrData.stallName,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        totalAmount: reservation.totalAmount,
      };
      existingQR.isValid = true;
      existingQR.validUntil = reservation.endDate;
      existingQR.expiresAt = expiresAt;
      await existingQR.save();
      return existingQR;
    }

    const qrCodeRecord = new QRCodeModel({
      reservation: reservation._id,
      user: user._id,
      qrCodeData: encryptedData,
      encryptedData: encryptedData,
      qrCodeImage: qrCodeImage,
      metadata: {
        reservationNumber: reservation.reservationNumber,
        stallName: qrData.stallName,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        totalAmount: reservation.totalAmount,
      },
      validUntil: reservation.endDate,
      expiresAt: expiresAt,
    });

    await qrCodeRecord.save();
    return qrCodeRecord;
  } catch (error) {
    throw new Error(`QR code generation failed: ${error.message}`);
  }
};

/**
 * Verify and decode QR code
 */
const verifyQRCode = async (encryptedData) => {
  try {
    // Decrypt data
    const qrData = decrypt(encryptedData);

    // Verify hash
    const { hash, ...dataWithoutHash } = qrData;
    const calculatedHash = generateHash(dataWithoutHash);

    if (hash !== calculatedHash) {
      throw new Error('QR code data integrity check failed');
    }

    // Find QR code record
    const qrCodeRecord = await QRCodeModel.findOne({
      reservation: qrData.reservationId,
    }).populate('reservation user');

    if (!qrCodeRecord) {
      throw new Error('QR code not found');
    }

    if (!qrCodeRecord.isValid) {
      throw new Error('QR code has been invalidated');
    }

    if (qrCodeRecord.isExpired()) {
      throw new Error('QR code has expired');
    }

    return {
      valid: true,
      qrCodeRecord,
      decodedData: qrData,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

/**
 * Scan QR code and mark as scanned
 */
const scanQRCode = async (encryptedData, scannedBy, location = null, deviceInfo = null) => {
  try {
    const verification = await verifyQRCode(encryptedData);

    if (!verification.valid) {
      throw new Error(verification.error);
    }

    const { qrCodeRecord } = verification;

    // Mark as scanned
    await qrCodeRecord.markAsScanned(scannedBy, location, deviceInfo);

    return {
      success: true,
      message: 'QR code scanned successfully',
      qrCodeRecord,
      decodedData: verification.decodedData,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Invalidate QR code
 */
const invalidateQRCode = async (reservationId) => {
  try {
    const qrCodeRecord = await QRCodeModel.findOne({ reservation: reservationId });

    if (!qrCodeRecord) {
      throw new Error('QR code not found');
    }

    await qrCodeRecord.invalidate();

    return {
      success: true,
      message: 'QR code invalidated successfully',
    };
  } catch (error) {
    throw new Error(`QR code invalidation failed: ${error.message}`);
  }
};

/**
 * Regenerate QR code
 */
const regenerateQRCode = async (reservation, user) => {
  try {
    // Invalidate existing QR code
    await invalidateQRCode(reservation._id);

    // Generate new QR code
    const newQRCode = await generateQRCode(reservation, user);

    return newQRCode;
  } catch (error) {
    throw new Error(`QR code regeneration failed: ${error.message}`);
  }
};

module.exports = {
  generateQRCode,
  verifyQRCode,
  scanQRCode,
  invalidateQRCode,
  regenerateQRCode,
};
