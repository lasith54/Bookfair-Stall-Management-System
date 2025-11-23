const Reservation = require('../models/Reservation');
const { validationResult } = require('express-validator');
const { generateReservationNumber } = require('../utils/generateReservationNumber');
const { calculateTotalAmount, calculateRefund, calculatePaymentDeadline } = require('../utils/pricing');
const stallServiceClient = require('../services/stallServiceClient');
const notificationServiceClient = require('../services/notificationServiceClient');

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

    // Validate and fetch stall details from stall service
    let stallData;
    try {
      stallData = await stallServiceClient.validateStallForReservation(stallId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Stall not found or unavailable'
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

    // Create reservation with auto-approved and paid status
    const reservation = await Reservation.create({
      userId,
      stallId,
      reservationNumber,
      startDate: start,
      endDate: end,
      duration,
      basePrice,
      totalAmount,
      paidAmount: totalAmount,
      remainingAmount: 0,
      purpose,
      specialRequests,
      status: 'completed', 
      paymentStatus: 'paid',
      approvedAt: new Date(),
      submittedAt: new Date()
    });

    // Update stall status to 'reserved'
    try {
      await stallServiceClient.updateStallStatus(stallId, 'reserved');
    } catch (error) {
      console.error('Error updating stall status:', error.message);
      // Continue even if stall status update fails
    }

    // Populate user and stall info
    await reservation.populate('userId', 'name email contactNumber');
    await reservation.populate('stallId', 'stallNumber location pricing');

    // Send confirmation notification with QR code (non-blocking)
    notificationServiceClient.sendReservationConfirmed(
      reservation,
      reservation.userId,
      stallData
    ).catch(err => console.error('Notification error:', err.message));

    res.status(201).json({
      success: true,
      message: 'Reservation created, confirmed, and payment completed successfully',
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
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const userId = req.user.userId;

    // Build filter
    const filter = { userId };
    if (status) filter.status = status;

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

    // Build timeline for simplified flow
    const timeline = [];

    if (reservation.status === 'confirmed') {
      timeline.push({ 
        action: 'Confirmed', 
        date: reservation.submittedAt || reservation.createdAt, 
        status: 'completed' 
      });
    }

    if (reservation.cancelledAt) {
      timeline.push({ 
        action: 'Cancelled', 
        date: reservation.cancelledAt, 
        status: 'completed' 
      });
    }

    if (reservation.status === 'completed') {
      timeline.push({ 
        action: 'Completed', 
        date: reservation.updatedAt, 
        status: 'completed' 
      });
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

    await reservation.save();

    // Update stall status back to 'available'
    try {
      await stallServiceClient.updateStallStatus(reservation.stallId, 'available');
    } catch (error) {
      console.error('Error updating stall status on cancellation:', error.message);
      // Continue even if stall status update fails
    }

    // Populate for response and notification
    await reservation.populate('userId', 'name email contactNumber');
    await reservation.populate('stallId', 'stallNumber location');

    // Fetch stall details for notification
    let stallData;
    try {
      stallData = await stallServiceClient.getStallById(reservation.stallId._id || reservation.stallId);
    } catch (error) {
      console.error('Failed to fetch stall for cancellation notification:', error.message);
      stallData = reservation.stallId; // Use populated data as fallback
    }

    // Send cancellation notification (non-blocking)
    notificationServiceClient.sendReservationCancelled(
      reservation,
      reservation.userId,
      stallData,
      refundInfo.refundAmount,
      refundInfo.refundPercentage
    ).catch(err => console.error('Notification error:', err.message));

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
