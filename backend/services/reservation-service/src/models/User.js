const mongoose = require('mongoose');

// Minimal User schema for reservation service (actual model defined in auth-service)
// This is needed for Mongoose populate functionality
const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: String,
  isActive: Boolean
}, {
  strict: false,  // Allow other fields from auth-service
  collection: 'users'  // Point to the same collection as auth-service
});

module.exports = mongoose.model('User', userSchema);
