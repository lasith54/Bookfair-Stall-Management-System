const express = require('express');
const router = express.Router();
const Stall = require('../models/Stall');

/**
 * Internal route for service-to-service communication
 * Updates stall status without authentication
 * Should only be accessible from other services within the Docker network
 */
router.patch('/stalls/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['available', 'reserved', 'maintenance', 'inactive'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find and update stall
    const stall = await Stall.findById(id);
    if (!stall) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found'
      });
    }

    stall.status = status;
    await stall.save();

    res.status(200).json({
      success: true,
      message: 'Stall status updated successfully',
      data: {
        stall
      }
    });
  } catch (error) {
    console.error('Internal stall status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stall status',
      error: error.message
    });
  }
});

module.exports = router;
