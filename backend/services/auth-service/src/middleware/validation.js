const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Registration validation rules
const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^(\+94[0-9]{9}|[0-9]{10})$/)
    .withMessage('Contact number must be a valid Sri Lankan phone number (+94xxxxxxxxx or 0xxxxxxxxx)'),
  body('businessName')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  body('role')
    .optional()
    .isIn(['vendor', 'publisher'])
    .withMessage('Role must be either vendor or publisher'),
];

// Login validation rules
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Refresh token validation rules
const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  refreshTokenValidation,
};
