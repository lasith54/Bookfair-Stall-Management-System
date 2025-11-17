const StallCategory = require('../models/StallCategory');
const Stall = require('../models/Stall');
const { validationResult } = require('express-validator');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const { includeInactive = false } = req.query;
    
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    
    const categories = await StallCategory.find(filter)
      .populate('stallCount')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving categories',
      error: error.message
    });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await StallCategory.findById(id).populate('stallCount');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get stalls in this category
    const stalls = await Stall.find({ category: id, isActive: true })
      .select('stallNumber location status pricing');

    res.status(200).json({
      success: true,
      data: {
        category,
        stalls
      }
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving category',
      error: error.message
    });
  }
};

// Create new category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, icon, color } = req.body;

    // Check if category name already exists
    const existingCategory = await StallCategory.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = new StallCategory({
      name,
      description,
      icon,
      color
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// Update category (Admin only)
exports.updateCategory = async (req, res) => {
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

    // Check if category name already exists (if being updated)
    if (updates.name) {
      const existingCategory = await StallCategory.findOne({
        name: updates.name,
        _id: { $ne: id }
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    const category = await StallCategory.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// Delete category (soft delete - Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has stalls
    const stallCount = await Stall.countDocuments({ category: id, isActive: true });
    if (stallCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${stallCount} stall(s) are still using this category`
      });
    }

    const category = await StallCategory.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};
