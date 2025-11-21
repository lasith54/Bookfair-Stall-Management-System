const mongoose = require('mongoose');

// Minimal Stall schema for reservation service (actual model defined in stall-service)
// This is needed for Mongoose populate functionality
const stallSchema = new mongoose.Schema({
  stallNumber: String,
  building: String,
  floor: String,
  area: Number,
  location: String,
  status: String
}, {
  strict: false,  // Allow other fields from stall-service
  collection: 'stalls'  // Point to the same collection as stall-service
});

module.exports = mongoose.model('Stall', stallSchema);
