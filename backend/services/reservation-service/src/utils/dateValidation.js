/**
 * Validate if date is in the future
 * @param {Date} date - Date to validate
 * @returns {Boolean}
 */
exports.isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate >= today;
};

/**
 * Validate date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Number} maxDuration - Maximum duration in days (default 30)
 * @returns {Object} {isValid, error}
 */
exports.validateDateRange = (startDate, endDate, maxDuration = 30) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end <= start) {
    return {
      isValid: false,
      error: 'End date must be after start date'
    };
  }
  
  const duration = (end - start) / (1000 * 60 * 60 * 24);
  
  if (duration > maxDuration) {
    return {
      isValid: false,
      error: `Reservation cannot exceed ${maxDuration} days`
    };
  }
  
  return { isValid: true };
};

/**
 * Check if dates overlap
 * @param {Date} start1 - First period start
 * @param {Date} end1 - First period end
 * @param {Date} start2 - Second period start
 * @param {Date} end2 - Second period end
 * @returns {Boolean}
 */
exports.datesOverlap = (start1, end1, start2, end2) => {
  return start1 <= end2 && end1 >= start2;
};
