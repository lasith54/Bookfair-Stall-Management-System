const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema(
  {
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    qrCodeData: {
      type: String,
      required: true,
    },
    encryptedData: {
      type: String,
      required: true,
    },
    qrCodeImage: {
      type: String,
      required: true,
    },
    metadata: {
      reservationNumber: String,
      stallName: String,
      startDate: Date,
      endDate: Date,
      totalAmount: Number,
    },
    isScanned: {
      type: Boolean,
      default: false,
    },
    scannedAt: {
      type: Date,
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    scanCount: {
      type: Number,
      default: 0,
    },
    scanHistory: [
      {
        scannedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        scannedAt: {
          type: Date,
          default: Date.now,
        },
        location: String,
        deviceInfo: String,
      },
    ],
    isValid: {
      type: Boolean,
      default: true,
    },
    validUntil: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
qrCodeSchema.index({ createdAt: -1 });
qrCodeSchema.index({ isValid: 1, expiresAt: 1 });
qrCodeSchema.index({ isScanned: 1 });

// Method to mark QR code as scanned
qrCodeSchema.methods.markAsScanned = function (scannedBy, location = null, deviceInfo = null) {
  this.isScanned = true;
  this.scannedAt = new Date();
  this.scannedBy = scannedBy;
  this.scanCount += 1;
  
  this.scanHistory.push({
    scannedBy,
    scannedAt: new Date(),
    location,
    deviceInfo,
  });
  
  return this.save();
};

// Method to invalidate QR code
qrCodeSchema.methods.invalidate = function () {
  this.isValid = false;
  return this.save();
};

// Check if QR code is expired
qrCodeSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

// Static method to find valid QR code
qrCodeSchema.statics.findValid = function (reservationId) {
  return this.findOne({
    reservation: reservationId,
    isValid: true,
    expiresAt: { $gt: new Date() },
  });
};

// Static method to cleanup expired QR codes
qrCodeSchema.statics.cleanupExpired = function () {
  return this.updateMany(
    { expiresAt: { $lt: new Date() }, isValid: true },
    { $set: { isValid: false } }
  );
};

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
