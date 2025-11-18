/**
 * Calculate total amount for a reservation
 * @param {Number} basePrice - Base price per day
 * @param {Number} duration - Duration in days
 * @param {Array} additionalCharges - Array of {description, amount}
 * @param {Object} discount - {type: 'percentage'|'fixed', value: Number, reason: String}
 * @returns {Number} Total amount
 */
exports.calculateTotalAmount = (basePrice, duration, additionalCharges = [], discount = null) => {
  // Base amount
  let total = basePrice * duration;
  
  // Add additional charges
  const additionalTotal = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
  total += additionalTotal;
  
  // Apply discount
  if (discount) {
    if (discount.type === 'percentage') {
      total -= (total * discount.value) / 100;
    } else if (discount.type === 'fixed') {
      total -= discount.value;
    }
  }
  
  return Math.max(0, Math.round(total));
};

/**
 * Calculate refund amount based on cancellation policy
 * @param {Number} totalAmount - Total reservation amount
 * @param {Number} paidAmount - Amount already paid
 * @param {Date} cancellationDate - Date of cancellation
 * @param {Date} startDate - Reservation start date
 * @returns {Object} {refundAmount, refundPercentage}
 */
exports.calculateRefund = (totalAmount, paidAmount, cancellationDate, startDate) => {
  const daysUntilStart = Math.ceil((startDate - cancellationDate) / (1000 * 60 * 60 * 24));
  
  let refundPercentage = 0;
  
  if (daysUntilStart > 30) {
    refundPercentage = 90;  // 90% refund if cancelled 30+ days before
  } else if (daysUntilStart > 14) {
    refundPercentage = 50;  // 50% refund if cancelled 14-30 days before
  } else if (daysUntilStart > 7) {
    refundPercentage = 25;  // 25% refund if cancelled 7-14 days before
  }
  // No refund if less than 7 days
  
  const refundAmount = Math.round((paidAmount * refundPercentage) / 100);
  
  return {
    refundAmount,
    refundPercentage
  };
};

/**
 * Calculate payment deadline (7 days from approval)
 * @param {Date} approvalDate - Date of approval
 * @returns {Date} Payment deadline
 */
exports.calculatePaymentDeadline = (approvalDate = new Date()) => {
  const deadline = new Date(approvalDate);
  deadline.setDate(deadline.getDate() + 7);
  return deadline;
};
