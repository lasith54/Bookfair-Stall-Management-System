const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getMyPreferences,
  updatePreferences,
  resetPreferences,
} = require('../controllers/preferenceController');
const { validatePreferenceUpdate } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Get user preferences
router.get('/', getMyPreferences);

// Update preferences
router.put('/', validatePreferenceUpdate, updatePreferences);

// Reset preferences to default
router.post('/reset', resetPreferences);

module.exports = router;
