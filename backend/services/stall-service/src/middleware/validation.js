const { body } = require('express-validator');

// Stall validation rules
exports.createStallValidation = [
  body('location.zone')
    .trim()
    .notEmpty().withMessage('Zone is required')
    .isLength({ min: 1, max: 50 }).withMessage('Zone must be 1-50 characters'),
  
  body('location.floor')
    .trim()
    .notEmpty().withMessage('Floor is required')
    .isLength({ min: 1, max: 50 }).withMessage('Floor must be 1-50 characters'),
  
  body('dimensions.width')
    .isNumeric().withMessage('Width must be a number')
    .custom((value) => value >= 1).withMessage('Width must be at least 1 meter'),
  
  body('dimensions.length')
    .isNumeric().withMessage('Length must be a number')
    .custom((value) => value >= 1).withMessage('Length must be at least 1 meter'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  
  body('pricing.basePrice')
    .isNumeric().withMessage('Base price must be a number')
    .custom((value) => value >= 0).withMessage('Price cannot be negative')
];

exports.updateStallValidation = [
  body('location.zone')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Zone must be 1-50 characters'),
  
  body('location.floor')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Floor must be 1-50 characters'),
  
  body('dimensions.width')
    .optional()
    .isNumeric().withMessage('Width must be a number')
    .custom((value) => value >= 1).withMessage('Width must be at least 1 meter'),
  
  body('dimensions.length')
    .optional()
    .isNumeric().withMessage('Length must be a number')
    .custom((value) => value >= 1).withMessage('Length must be at least 1 meter'),
  
  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
  
  body('pricing.basePrice')
    .optional()
    .isNumeric().withMessage('Base price must be a number')
    .custom((value) => value >= 0).withMessage('Price cannot be negative'),
  
  body('status')
    .optional()
    .isIn(['available', 'reserved', 'occupied', 'maintenance', 'inactive'])
    .withMessage('Invalid status value')
];

// Category validation rules
exports.createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be 2-50 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

exports.updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be 2-50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];
