const Reservation = require('../models/Reservation');

/**
 * Middleware to check if a stall is available for the requested dates
 */
exports.checkAvailability = async (req, res, next) => {
  try {
    const { stallId, startDate, endDate } = req.body;
    const reservationId = req.params.id || null;
    
    const availability = await Reservation.checkAvailability(
      stallId,
      new Date(startDate),
      new Date(endDate),
      reservationId
    );
    
    if (!availability.isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'Stall is not available for the selected dates',
        data: {
          conflicts: availability.conflicts.map(c => ({
            reservationNumber: c.reservationNumber,
            startDate: c.startDate,
            endDate: c.endDate,
            status: c.status
          }))
        }
      });
    }
    
    next();
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability'
    });
  }
};
