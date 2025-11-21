const Reservation = require('../models/Reservation');
const { validationResult } = require('express-validator');
const { calculateTotalAmount, calculatePaymentDeadline } = require('../utils/pricing');
const stallServiceClient = require('../services/stallServiceClient');
const notificationServiceClient = require('../services/notificationServiceClient');

// Get all reservations (admin)
exports.getAllReservations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      userId,
      stallId,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (stallId) filter.stallId = stallId;
    
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    
    if (search) {
      filter.$or = [
        { reservationNumber: new RegExp(search, 'i') }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query
    const reservations = await Reservation.find(filter)
      .populate('userId', 'name email contactNumber role')
      .populate('stallId', 'stallNumber location pricing category')
      .populate('approvedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Reservation.countDocuments(filter);

    // Calculate statistics
    const statistics = await Reservation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalRevenue: {
            $sum: { $cond: [{ $in: ['$status', ['confirmed', 'completed']] }, '$totalAmount', 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        reservations,
        statistics: statistics[0] || {
          total: 0,
          confirmed: 0,
          cancelled: 0,
          completed: 0,
          totalRevenue: 0
        },
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving reservations',
      error: error.message
    });
  }
};

// Approve reservation
exports.approveReservation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { notes, discount, paymentDeadline } = req.body;
    const adminId = req.user.userId;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    if (reservation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending reservations can be approved'
      });
    }

    // Apply discount if provided
    if (discount) {
      reservation.discount = discount;
      // Recalculate total amount
      reservation.totalAmount = calculateTotalAmount(
        reservation.basePrice,
        reservation.duration,
        reservation.additionalCharges,
        discount
      );
      reservation.remainingAmount = reservation.totalAmount - reservation.paidAmount;
    }

    // Update reservation
    reservation.status = 'approved';
    reservation.approvedBy = adminId;
    reservation.approvedAt = new Date();
    reservation.paymentDeadline = paymentDeadline 
      ? new Date(paymentDeadline) 
      : calculatePaymentDeadline();
    
    if (notes) {
      reservation.notes = notes;
    }

    await reservation.save();

    await reservation.populate('userId', 'name email');
    await reservation.populate('stallId', 'stallNumber location');
    await reservation.populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Reservation approved successfully',
      data: {
        reservation
      }
    });
  } catch (error) {
    console.error('Approve reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving reservation',
      error: error.message
    });
  }
};

// Reject reservation
exports.rejectReservation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    if (reservation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending reservations can be rejected'
      });
    }

    reservation.status = 'rejected';
    reservation.rejectionReason = reason;

    await reservation.save();

    await reservation.populate('userId', 'name email');
    await reservation.populate('stallId', 'stallNumber location');

    res.status(200).json({
      success: true,
      message: 'Reservation rejected',
      data: {
        reservation
      }
    });
  } catch (error) {
    console.error('Reject reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting reservation',
      error: error.message
    });
  }
};

// Update reservation (admin)
exports.updateReservation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updates = req.body;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'status',
      'additionalCharges',
      'notes',
      'specialRequests'
    ];

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        reservation[field] = updates[field];
      }
    });

    // Recalculate total if additional charges changed
    if (updates.additionalCharges) {
      reservation.totalAmount = calculateTotalAmount(
        reservation.basePrice,
        reservation.duration,
        updates.additionalCharges,
        reservation.discount
      );
    }

    await reservation.save();

    await reservation.populate('userId', 'name email');
    await reservation.populate('stallId', 'stallNumber location');

    res.status(200).json({
      success: true,
      message: 'Reservation updated successfully',
      data: {
        reservation
      }
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reservation',
      error: error.message
    });
  }
};

// Confirm reservation
exports.confirmReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // In simplified flow, reservations are already confirmed on creation
    // This endpoint can be used to re-confirm or update status to completed
    if (!['confirmed', 'completed'].includes(reservation.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation status for confirmation'
      });
    }

    if (notes) {
      reservation.notes = notes;
      await reservation.save();
    }

    await reservation.populate('userId', 'name email');
    await reservation.populate('stallId', 'stallNumber location');

    res.status(200).json({
      success: true,
      message: 'Reservation confirmed successfully',
      data: {
        reservation
      }
    });
  } catch (error) {
    console.error('Confirm reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming reservation',
      error: error.message
    });
  }
};

// Get reservation by ID (admin)
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id)
      .populate('userId', 'name email contactNumber role')
      .populate('stallId', 'stallNumber location pricing amenities features category')
      .populate('approvedBy', 'name email')
      .populate('cancelledBy', 'name email');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        reservation
      }
    });
  } catch (error) {
    console.error('Get reservation by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving reservation',
      error: error.message
    });
  }
};

// Generate report
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'status' } = req.query;

    // Build filter for date range
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Get summary statistics
    const summary = await Reservation.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalReservations: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageBookingValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Group by specified field
    let breakdown = [];
    if (groupBy === 'status') {
      breakdown = await Reservation.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        },
        { $sort: { count: -1 } }
      ]);
    }

    res.status(200).json({
      success: true,
      data: {
        summary: summary[0] || {
          totalReservations: 0,
          totalRevenue: 0,
          averageBookingValue: 0
        },
        breakdown,
        filters: {
          startDate,
          endDate,
          groupBy
        }
      }
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message
    });
  }
};
