const Reservation = require('../models/Reservation');

/**
 * Generate unique reservation number
 * Format: RES-YYYY-NNNN
 * @returns {Promise<String>} Reservation number
 */
exports.generateReservationNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `RES-${year}-`;
  
  // Find the last reservation number for this year
  const lastReservation = await Reservation.findOne({
    reservationNumber: new RegExp(`^${prefix}`)
  }).sort({ createdAt: -1 });
  
  let sequence = 1;
  if (lastReservation) {
    const lastNumber = parseInt(lastReservation.reservationNumber.split('-')[2]);
    sequence = lastNumber + 1;
  }
  
  return `${prefix}${String(sequence).padStart(4, '0')}`;
};
