const qrConfig = {
  secretKey: process.env.QR_SECRET_KEY || 'default-secret-key',
  algorithm: 'aes-256-cbc',
  ivLength: 16,
  options: {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    quality: 0.95,
    margin: 1,
    width: parseInt(process.env.QR_CODE_SIZE) || 300,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  },
};

module.exports = qrConfig;
