const { body } = require('express-validator');

// Create reservation validation
exports.createReservationValidation = [
  body('stallId')
    .notEmpty().withMessage('Stall ID is required')
    .isMongoId().withMessage('Invalid stall ID'),
  
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid start date format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Start date must be in the future');
      }
      return true;
    }),
  
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('Invalid end date format')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);
      if (duration > 30) {
        throw new Error('Reservation cannot exceed 30 days');
      }
      return true;
    }),
  
  body('purpose')
    .trim()
    .notEmpty().withMessage('Purpose is required')
    .isLength({ min: 10, max: 500 }).withMessage('Purpose must be 10-500 characters'),
  
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Special requests cannot exceed 1000 characters'),
  
  body('duration')
    .optional()
    .isInt({ min: 1, max: 30 }).withMessage('Duration must be between 1 and 30 days')
];

// Cancel reservation validation
exports.cancelReservationValidation = [
  body('reason')
    .trim()
    .notEmpty().withMessage('Cancellation reason is required')
    .isLength({ min: 10, max: 500 }).withMessage('Reason must be 10-500 characters')
];

// Approve reservation validation
exports.approveReservationValidation = [
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
  
  body('discount.type')
    .optional()
    .isIn(['percentage', 'fixed']).withMessage('Discount type must be percentage or fixed'),
  
  body('discount.value')
    .optional()
    .isNumeric().withMessage('Discount value must be a number')
    .custom((value) => value >= 0).withMessage('Discount value cannot be negative'),
  
  body('discount.reason')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Discount reason cannot exceed 200 characters'),
  
  body('paymentDeadline')
    .optional()
    .isISO8601().withMessage('Invalid payment deadline format')
];

// Reject reservation validation
exports.rejectReservationValidation = [
  body('reason')
    .trim()
    .notEmpty().withMessage('Rejection reason is required')
    .isLength({ min: 10, max: 500 }).withMessage('Reason must be 10-500 characters')
];

// Update reservation validation (admin)
exports.updateReservationValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status value'),
  
  body('additionalCharges')
    .optional()
    .isArray().withMessage('Additional charges must be an array'),
  
  body('additionalCharges.*.description')
    .optional()
    .trim()
    .notEmpty().withMessage('Charge description is required'),
  
  body('additionalCharges.*.amount')
    .optional()
    .isNumeric().withMessage('Charge amount must be a number')
    .custom((value) => value >= 0).withMessage('Charge amount cannot be negative'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
  
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'partial', 'paid', 'refunded'])
    .withMessage('Invalid payment status'),
  
  body('paidAmount')
    .optional()
    .isNumeric().withMessage('Paid amount must be a number')
    .custom((value) => value >= 0).withMessage('Paid amount cannot be negative')
];

// Check availability validation
exports.checkAvailabilityValidation = [
  body('stallId')
    .notEmpty().withMessage('Stall ID is required')
    .isMongoId().withMessage('Invalid stall ID'),
  
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid start date format'),
  
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('Invalid end date format')
];
