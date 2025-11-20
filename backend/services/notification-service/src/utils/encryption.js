const crypto = require('crypto');
const qrConfig = require('../config/qrcode');

/**
 * Encrypt data for QR code
 */
const encrypt = (data) => {
  try {
    const iv = crypto.randomBytes(qrConfig.ivLength);
    const cipher = crypto.createCipheriv(
      qrConfig.algorithm,
      Buffer.from(qrConfig.secretKey, 'hex').slice(0, 32),
      iv
    );

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt QR code data
 */
const decrypt = (encryptedData) => {
  try {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(
      qrConfig.algorithm,
      Buffer.from(qrConfig.secretKey, 'hex').slice(0, 32),
      iv
    );

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

/**
 * Generate hash for data integrity
 */
const generateHash = (data) => {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
};

/**
 * Verify data integrity
 */
const verifyHash = (data, hash) => {
  return generateHash(data) === hash;
};

module.exports = {
  encrypt,
  decrypt,
  generateHash,
  verifyHash,
};
