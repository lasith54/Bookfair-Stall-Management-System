const mongoose = require('mongoose');

const stallSchema = new mongoose.Schema({
  stallNumber: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true
  },
  location: {
    zone: {
      type: String,
      required: [true, 'Zone is required'],
      trim: true
    },
    floor: {
      type: String,
      required: [true, 'Floor is required'],
      trim: true
    },
    section: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      trim: true
    }
  },
  dimensions: {
    width: {
      type: Number,
      required: [true, 'Width is required'],
      min: [1, 'Width must be at least 1 meter']
    },
    length: {
      type: Number,
      required: [true, 'Length is required'],
      min: [1, 'Length must be at least 1 meter']
    },
    height: {
      type: Number,
      default: 3
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StallCategory',
    required: [true, 'Category is required']
  },
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    pricingModel: {
      type: String,
      enum: ['per_day', 'per_event', 'per_month'],
      default: 'per_day'
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  features: {
    hasElectricity: {
      type: Boolean,
      default: true
    },
    hasWifi: {
      type: Boolean,
      default: false
    },
    hasStorage: {
      type: Boolean,
      default: false
    },
    hasDisplay: {
      type: Boolean,
      default: false
    }
  },
  capacity: {
    maxOccupants: {
      type: Number,
      default: 2
    },
    maxItems: {
      type: Number
    }
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied', 'maintenance', 'inactive'],
    default: 'available'
  },
  images: [{
    url: String,
    caption: String
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for area
stallSchema.virtual('area').get(function() {
  return this.dimensions.width * this.dimensions.length;
});

// Virtual for full location
stallSchema.virtual('fullLocation').get(function() {
  let location = `${this.location.zone}, ${this.location.floor}`;
  if (this.location.section) {
    location += `, ${this.location.section}`;
  }
  if (this.location.position) {
    location += `, ${this.location.position}`;
  }
  return location;
});

// Ensure virtuals are included in JSON
stallSchema.set('toJSON', { virtuals: true });
stallSchema.set('toObject', { virtuals: true });

// Indexes
stallSchema.index({ stallNumber: 1 });
stallSchema.index({ status: 1 });
stallSchema.index({ category: 1 });
stallSchema.index({ 'location.zone': 1, 'location.floor': 1 });
stallSchema.index({ 'pricing.basePrice': 1 });
stallSchema.index({ isActive: 1 });

// Pre-save hook to generate stall number if not provided
stallSchema.pre('save', async function(next) {
  if (!this.stallNumber) {
    const zone = this.location.zone;
    const floor = this.location.floor;
    
    // Find the last stall in this zone/floor
    const lastStall = await this.constructor.findOne({
      'location.zone': zone,
      'location.floor': floor
    }).sort({ stallNumber: -1 });
    
    let sequence = 1;
    if (lastStall && lastStall.stallNumber) {
      const lastNumber = parseInt(lastStall.stallNumber.split('-').pop());
      if (!isNaN(lastNumber)) {
        sequence = lastNumber + 1;
      }
    }
    
    this.stallNumber = `${zone}${floor}-${String(sequence).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Stall', stallSchema);
