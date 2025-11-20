const nodemailer = require('nodemailer');

const emailConfig = {
  transporter: nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // For development
    },
  }),
  defaults: {
    from: process.env.SMTP_FROM,
  },
};

module.exports = emailConfig;
