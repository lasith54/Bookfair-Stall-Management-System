const mongoose = require('mongoose');

const stallCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    default: 'category'
  },
  color: {
    type: String,
    default: '#007bff'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for stall count
stallCategorySchema.virtual('stallCount', {
  ref: 'Stall',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Ensure virtuals are included in JSON
stallCategorySchema.set('toJSON', { virtuals: true });
stallCategorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('StallCategory', stallCategorySchema);
