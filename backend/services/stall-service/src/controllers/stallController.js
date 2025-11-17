const Stall = require('../models/Stall');
const StallCategory = require('../models/StallCategory');
const { validationResult } = require('express-validator');

// Get all stalls with filtering and pagination
exports.getAllStalls = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      zone,
      floor,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = { isActive: true };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (zone) filter['location.zone'] = zone;
    if (floor) filter['location.floor'] = floor;
    
    if (minPrice || maxPrice) {
      filter['pricing.basePrice'] = {};
      if (minPrice) filter['pricing.basePrice'].$gte = Number(minPrice);
      if (maxPrice) filter['pricing.basePrice'].$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { stallNumber: new RegExp(search, 'i') },
        { 'location.zone': new RegExp(search, 'i') },
        { notes: new RegExp(search, 'i') }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query
    const stalls = await Stall.find(filter)
      .populate('category', 'name description icon color')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Stall.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        stalls,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all stalls error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving stalls',
      error: error.message
    });
  }
};

// Get stall by ID
exports.getStallById = async (req, res) => {
  try {
    const { id } = req.params;

    const stall = await Stall.findById(id).populate('category');

    if (!stall) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { stall }
    });
  } catch (error) {
    console.error('Get stall by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving stall',
      error: error.message
    });
  }
};

// Create new stall (Admin/Employee only)
exports.createStall = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const stallData = req.body;

    // Check if category exists
    const category = await StallCategory.findById(stallData.category);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if stall number already exists (if provided)
    if (stallData.stallNumber) {
      const existingStall = await Stall.findOne({ stallNumber: stallData.stallNumber });
      if (existingStall) {
        return res.status(400).json({
          success: false,
          message: 'Stall number already exists'
        });
      }
    }

    const stall = new Stall(stallData);
    await stall.save();

    await stall.populate('category');

    res.status(201).json({
      success: true,
      message: 'Stall created successfully',
      data: { stall }
    });
  } catch (error) {
    console.error('Create stall error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating stall',
      error: error.message
    });
  }
};

// Update stall (Admin/Employee only)
exports.updateStall = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check if category exists (if being updated)
    if (updates.category) {
      const category = await StallCategory.findById(updates.category);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    // Check if stall number already exists (if being updated)
    if (updates.stallNumber) {
      const existingStall = await Stall.findOne({
        stallNumber: updates.stallNumber,
        _id: { $ne: id }
      });
      if (existingStall) {
        return res.status(400).json({
          success: false,
          message: 'Stall number already exists'
        });
      }
    }

    const stall = await Stall.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('category');

    if (!stall) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stall updated successfully',
      data: { stall }
    });
  } catch (error) {
    console.error('Update stall error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stall',
      error: error.message
    });
  }
};

// Delete stall (soft delete - Admin only)
exports.deleteStall = async (req, res) => {
  try {
    const { id } = req.params;

    const stall = await Stall.findByIdAndUpdate(
      id,
      { isActive: false, status: 'inactive' },
      { new: true }
    );

    if (!stall) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stall deleted successfully'
    });
  } catch (error) {
    console.error('Delete stall error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting stall',
      error: error.message
    });
  }
};

// Update stall status (Admin/Employee only)
exports.updateStallStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['available', 'reserved', 'occupied', 'maintenance', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const stall = await Stall.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('category');

    if (!stall) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stall status updated successfully',
      data: { stall }
    });
  } catch (error) {
    console.error('Update stall status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stall status',
      error: error.message
    });
  }
};

// Bulk update stalls (Admin only)
exports.bulkUpdateStalls = async (req, res) => {
  try {
    const { stallIds, updates } = req.body;

    if (!stallIds || !Array.isArray(stallIds) || stallIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Stall IDs array is required'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates object is required'
      });
    }

    const result = await Stall.updateMany(
      { _id: { $in: stallIds } },
      { $set: updates }
    );

    res.status(200).json({
      success: true,
      message: 'Stalls updated successfully',
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update stalls error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stalls',
      error: error.message
    });
  }
};

// Get stall statistics (Admin/Employee only)
exports.getStallStatistics = async (req, res) => {
  try {
    const totalStalls = await Stall.countDocuments({ isActive: true });
    const availableStalls = await Stall.countDocuments({ status: 'available', isActive: true });
    const reservedStalls = await Stall.countDocuments({ status: 'reserved', isActive: true });
    const occupiedStalls = await Stall.countDocuments({ status: 'occupied', isActive: true });
    const maintenanceStalls = await Stall.countDocuments({ status: 'maintenance', isActive: true });

    // Get stalls by category
    const stallsByCategory = await Stall.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'stallcategories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          categoryName: '$category.name',
          count: 1
        }
      }
    ]);

    // Get stalls by zone
    const stallsByZone = await Stall.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$location.zone',
          count: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          }
        }
      }
    ]);

    // Calculate average price
    const priceStats = await Stall.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$pricing.basePrice' },
          minPrice: { $min: '$pricing.basePrice' },
          maxPrice: { $max: '$pricing.basePrice' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalStalls,
          available: availableStalls,
          reserved: reservedStalls,
          occupied: occupiedStalls,
          maintenance: maintenanceStalls,
          occupancyRate: totalStalls > 0 ? ((totalStalls - availableStalls) / totalStalls * 100).toFixed(2) : 0
        },
        byCategory: stallsByCategory,
        byZone: stallsByZone,
        pricing: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 }
      }
    });
  } catch (error) {
    console.error('Get stall statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics',
      error: error.message
    });
  }
};
