const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  stallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stall',
    required: [true, 'Stall is required']
  },
  reservationNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // Rental Period
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  duration: {
    type: Number
  },
  
  // Pricing
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  additionalCharges: [{
    description: String,
    amount: { type: Number, min: 0 }
  }],
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: { type: Number, min: 0 },
    reason: String
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentDeadline: {
    type: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Approval
  submittedAt: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  
  // Additional Info
  purpose: {
    type: String,
    required: [true, 'Purpose is required']
  },
  specialRequests: String,
  notes: String,
  
  // Cancellation
  cancelledAt: Date,
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  refundAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate duration before saving
reservationSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const diff = this.endDate.getTime() - this.startDate.getTime();
    this.duration = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  
  // Calculate remaining amount
  this.remainingAmount = this.totalAmount - this.paidAmount;
  
  next();
});

// Check for overlapping reservations
reservationSchema.statics.checkAvailability = async function(stallId, startDate, endDate, excludeReservationId = null) {
  const query = {
    stallId,
    status: { $in: ['pending', 'approved', 'confirmed'] },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ]
  };
  
  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }
  
  const conflicts = await this.find(query);
  return {
    isAvailable: conflicts.length === 0,
    conflicts
  };
};

// Indexes
reservationSchema.index({ userId: 1 });
reservationSchema.index({ stallId: 1 });
reservationSchema.index({ reservationNumber: 1 }, { unique: true });
reservationSchema.index({ status: 1 });
reservationSchema.index({ startDate: 1, endDate: 1 });
reservationSchema.index({ paymentStatus: 1 });
reservationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Reservation', reservationSchema);
