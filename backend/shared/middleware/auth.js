const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseFormatter');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return errorResponse(res, 401, 'Access token is required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired');
    }
    return errorResponse(res, 500, 'Authentication failed');
  }
};

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Access denied: Insufficient permissions');
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
