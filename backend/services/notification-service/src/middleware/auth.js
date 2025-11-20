const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Normalize roles to lowercase for comparison
    const normalizedRoles = roles.map(role => role.toLowerCase());
    const userRole = req.user.role.toLowerCase();

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Insufficient permissions',
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
