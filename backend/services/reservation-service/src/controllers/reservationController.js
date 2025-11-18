const Reservation = require('../models/Reservation');
const { validationResult } = require('express-validator');
const { generateReservationNumber } = require('../utils/generateReservationNumber');
const { calculateTotalAmount, calculateRefund, calculatePaymentDeadline } = require('../utils/pricing');
const axios = require('axios');

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { stallId, startDate, endDate, purpose, specialRequests } = req.body;
    const userId = req.user.userId;

    // Fetch stall details from stall service
    let stallData;
    try {
      const stallResponse = await axios.get(
        `${process.env.STALL_SERVICE_URL}/api/stalls/${stallId}`
      );
      stallData = stallResponse.data.data.stall;
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found or unavailable'
      });
    }

    // Check if stall is available for booking
    if (stallData.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Stall is not available for reservation'
      });
    }

    // Generate reservation number
    const reservationNumber = await generateReservationNumber();

    // Calculate duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Calculate total amount
    const basePrice = stallData.pricing.basePrice;
    const totalAmount = calculateTotalAmount(basePrice, duration);

    // Create reservation
    const reservation = await Reservation.create({
      userId,
      stallId,
      reservationNumber,
      startDate: start,
      endDate: end,
      duration,
      basePrice,
      totalAmount,
      remainingAmount: totalAmount,
      purpose,
      specialRequests,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Populate user and stall info
    await reservation.populate('userId', 'name email contactNumber');
    await reservation.populate('stallId', 'stallNumber location pricing');

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: {
        reservation
      }
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating reservation',
      error: error.message
    });
  }
};

// Get user's reservations
exports.getMyReservations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const userId = req.user.userId;

    // Build filter
    const filter = { userId };
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query
    const reservations = await Reservation.find(filter)
      .populate('stallId', 'stallNumber location pricing category')
      .populate('stallId.category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Reservation.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        reservations,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving reservations',
      error: error.message
    });
  }
};

// Get reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const reservation = await Reservation.findOne({ _id: id, userId })
      .populate('userId', 'name email contactNumber')
      .populate('stallId', 'stallNumber location pricing amenities features category')
      .populate('stallId.category', 'name description')
      .populate('approvedBy', 'name email')
      .populate('cancelledBy', 'name email');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Build timeline
    const timeline = [
      { action: 'Created', date: reservation.submittedAt, status: 'completed' }
    ];

    if (reservation.approvedAt) {
      timeline.push({ action: 'Approved', date: reservation.approvedAt, status: 'completed' });
    }

    if (reservation.status === 'confirmed') {
      timeline.push({ action: 'Confirmed', date: reservation.updatedAt, status: 'completed' });
    }

    if (reservation.cancelledAt) {
      timeline.push({ action: 'Cancelled', date: reservation.cancelledAt, status: 'completed' });
    }

    res.status(200).json({
      success: true,
      data: {
        reservation,
        timeline
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

// Cancel reservation
exports.cancelReservation = async (req, res) => {
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
    const userId = req.user.userId;

    const reservation = await Reservation.findOne({ _id: id, userId });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check if reservation can be cancelled
    if (['cancelled', 'completed'].includes(reservation.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this reservation'
      });
    }

    // Calculate refund
    const refundInfo = calculateRefund(
      reservation.totalAmount,
      reservation.paidAmount,
      new Date(),
      reservation.startDate
    );

    // Update reservation
    reservation.status = 'cancelled';
    reservation.cancelledAt = new Date();
    reservation.cancellationReason = reason;
    reservation.cancelledBy = userId;
    reservation.refundAmount = refundInfo.refundAmount;

    if (reservation.paidAmount > 0) {
      reservation.paymentStatus = 'refunded';
    }

    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: {
        reservation,
        refundAmount: refundInfo.refundAmount,
        refundPercentage: refundInfo.refundPercentage
      }
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling reservation',
      error: error.message
    });
  }
};

// Check stall availability
exports.checkAvailability = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { stallId, startDate, endDate } = req.body;

    const availability = await Reservation.checkAvailability(
      stallId,
      new Date(startDate),
      new Date(endDate)
    );

    res.status(200).json({
      success: true,
      data: {
        isAvailable: availability.isAvailable,
        conflictingReservations: availability.conflicts.map(c => ({
          reservationNumber: c.reservationNumber,
          startDate: c.startDate,
          endDate: c.endDate,
          status: c.status
        }))
      }
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
};
