const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

/**
 * Register Handlebars helpers
 */
handlebars.registerHelper('formatDate', function (date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

handlebars.registerHelper('formatCurrency', function (amount) {
  if (!amount) return 'Rs. 0.00';
  return `Rs. ${parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
});

handlebars.registerHelper('formatDateTime', function (date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

handlebars.registerHelper('capitalize', function (str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
});

/**
 * Compile email template
 */
const compileTemplate = async (templateName, data) => {
  try {
    const templatePath = path.join(
      __dirname,
      '../templates/emails',
      `${templateName}.hbs`
    );
    
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    
    return template(data);
  } catch (error) {
    throw new Error(`Template compilation failed: ${error.message}`);
  }
};

/**
 * Get email template based on notification type
 */
const getEmailTemplate = async (type, data) => {
  const templateMap = {
    RESERVATION_CREATED: 'reservation-created',
    RESERVATION_APPROVED: 'reservation-approved',
    RESERVATION_REJECTED: 'reservation-rejected',
    RESERVATION_CONFIRMED: 'reservation-confirmed',
    PAYMENT_REMINDER: 'payment-reminder',
    RESERVATION_REMINDER: 'reservation-reminder',
    RESERVATION_CANCELLED: 'reservation-cancelled',
    QR_CODE_SENT: 'qrcode-email',
  };

  const templateName = templateMap[type] || 'default';
  
  return await compileTemplate(templateName, data);
};

module.exports = {
  compileTemplate,
  getEmailTemplate,
};
