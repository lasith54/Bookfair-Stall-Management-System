require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI?.replace('mongodb://mongodb:', 'mongodb://localhost:') 
  || 'mongodb://localhost:27017/bookfair';

// Import models (inline schemas to avoid dependencies)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true, trim: true },
  businessName: { type: String, trim: true },
  contactNumber: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  role: { type: String, enum: ['vendor', 'publisher', 'employee', 'admin'], default: 'vendor' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const stallCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  icon: { type: String, trim: true },
  color: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const stallSchema = new mongoose.Schema({
  stallNumber: { type: String, unique: true, trim: true, uppercase: true },
  location: {
    zone: { type: String, required: true, trim: true },
    floor: { type: String, required: true, trim: true },
    section: { type: String, trim: true },
    position: { type: String, trim: true }
  },
  dimensions: {
    width: { type: Number, required: true, min: 1 },
    length: { type: Number, required: true, min: 1 },
    height: { type: Number, default: 3 }
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'StallCategory', required: true },
  pricing: {
    basePrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'LKR' },
    pricingModel: { type: String, default: 'per_day' }
  },
  amenities: [{ type: String }],
  features: {
    hasElectricity: { type: Boolean, default: true },
    hasWifi: { type: Boolean, default: false },
    hasStorage: { type: Boolean, default: false },
    hasDisplay: { type: Boolean, default: false }
  },
  capacity: {
    maxOccupants: { type: Number, default: 2 },
    maxItems: { type: Number }
  },
  status: { type: String, enum: ['available', 'reserved', 'maintenance', 'inactive'], default: 'available' },
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const StallCategory = mongoose.model('StallCategory', stallCategorySchema);
const Stall = mongoose.model('Stall', stallSchema);

// Seed Data
const users = [
  {
    email: 'admin@bookfair.com',
    password: 'Admin@123',
    name: 'System Admin',
    contactNumber: '+94700000000',
    role: 'admin',
    isVerified: true,
    isActive: true
  },
  {
    email: 'employee@bookfair.com',
    password: 'Employee@123',
    name: 'Employee User',
    contactNumber: '+94700000001',
    role: 'employee',
    isVerified: true,
    isActive: true
  },
  {
    email: 'vendor@example.com',
    password: 'Vendor@123',
    name: 'John Vendor',
    businessName: 'John\'s Bookstore',
    contactNumber: '+94712345678',
    address: '123 Main St, Colombo',
    role: 'vendor',
    isVerified: true,
    isActive: true
  },
  {
    email: 'publisher@example.com',
    password: 'Publisher@123',
    name: 'Jane Publisher',
    businessName: 'ABC Publishing House',
    contactNumber: '+94723456789',
    address: '456 Book Ave, Kandy',
    role: 'publisher',
    isVerified: true,
    isActive: true
  },
  {
    email: 'vendor2@example.com',
    password: 'Vendor@123',
    name: 'Sarah Books',
    businessName: 'Sarah\'s Literature Corner',
    contactNumber: '+94734567890',
    address: '789 Reading Road, Galle',
    role: 'vendor',
    isVerified: true,
    isActive: true
  }
];

const categories = [
  {
    name: 'Books',
    description: 'General book stalls for various genres including fiction, non-fiction, educational, and reference books',
    icon: 'book',
    color: '#3498db'
  },
  {
    name: 'Publishing Houses',
    description: 'Stalls for established publishing companies and houses showcasing their latest releases',
    icon: 'building',
    color: '#e74c3c'
  },
  {
    name: 'Educational Materials',
    description: 'Stalls dedicated to textbooks, workbooks, study guides, and other educational resources',
    icon: 'graduation-cap',
    color: '#2ecc71'
  }
];

// Generate stalls
const generateStalls = (categoryIds) => {
  const stalls = [];
  const zones = ['A', 'B', 'C'];
  const floors = ['1', '2'];
  
  zones.forEach(zone => {
    floors.forEach(floor => {
      for (let i = 1; i <= 20; i++) {
        const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
        const basePrice = 5000 + Math.floor(Math.random() * 10000);
        
        const widths = [8, 10, 12];
        const lengths = [8, 10, 12];
        const width = widths[Math.floor(Math.random() * widths.length)];
        const length = lengths[Math.floor(Math.random() * lengths.length)];

        const possibleAmenities = ['Display Shelves', 'Counter', 'Storage Cabinet', 'Signage', 'Lighting'];
        const amenityCount = Math.floor(Math.random() * 3) + 2;
        const amenities = [];
        for (let j = 0; j < amenityCount; j++) {
          const amenity = possibleAmenities[Math.floor(Math.random() * possibleAmenities.length)];
          if (!amenities.includes(amenity)) {
            amenities.push(amenity);
          }
        }

        const section = i <= 10 ? 'Front' : 'Back';
        const position = `Row ${Math.ceil(i / 5)}`;

        let status = 'available';
        if (Math.random() < 0.15) {
          status = 'reserved';
        } else if (Math.random() < 0.05) {
          status = 'maintenance';
        }

        stalls.push({
          stallNumber: `${zone}${floor}-${String(i).padStart(3, '0')}`,
          location: { zone, floor, section, position },
          dimensions: { width, length, height: 3 },
          category: categoryId,
          pricing: { basePrice, currency: 'LKR', pricingModel: 'per_day' },
          amenities,
          features: {
            hasElectricity: true,
            hasWifi: Math.random() > 0.5,
            hasStorage: Math.random() > 0.3,
            hasDisplay: Math.random() > 0.2
          },
          capacity: {
            maxOccupants: Math.floor(Math.random() * 3) + 2,
            maxItems: Math.floor((width * length) / 2)
          },
          status,
          notes: status === 'maintenance' ? 'Under maintenance - will be available soon' : '',
          isActive: true
        });
      }
    });
  });

  return stalls;
};

// Main seed function
async function seedAll() {
  try {
    console.log('Starting database seeding...\n');
    console.log('Connecting to MongoDB...');
    console.log(`URI: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}\n`);
    
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await StallCategory.deleteMany({});
    await Stall.deleteMany({});
    console.log('Database cleared\n');

    // Seed Users
    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);
    users.forEach(u => {
      console.log(`   - ${u.role.toUpperCase()}: ${u.email} / ${u.password}`);
    });
    console.log('');

    // Seed Categories
    console.log('Creating stall categories...');
    const createdCategories = await StallCategory.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);
    createdCategories.forEach(c => {
      console.log(`   - ${c.name}: ${c.description.substring(0, 50)}...`);
    });
    console.log('');

    // Seed Stalls
    console.log('Creating stalls...');
    const categoryIds = createdCategories.map(cat => cat._id);
    const stallsData = generateStalls(categoryIds);
    const createdStalls = await Stall.insertMany(stallsData);
    console.log(`Created ${createdStalls.length} stalls\n`);

    // Print Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SEED SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('Users:');
    console.log(`   Total: ${createdUsers.length}`);
    console.log(`   - Admins: ${createdUsers.filter(u => u.role === 'admin').length}`);
    console.log(`   - Employees: ${createdUsers.filter(u => u.role === 'employee').length}`);
    console.log(`   - Vendors: ${createdUsers.filter(u => u.role === 'vendor').length}`);
    console.log(`   - Publishers: ${createdUsers.filter(u => u.role === 'publisher').length}\n`);

    console.log('Stall Categories:');
    console.log(`   Total: ${createdCategories.length}`);
    for (const category of createdCategories) {
      const count = await Stall.countDocuments({ category: category._id });
      console.log(`   - ${category.name}: ${count} stalls`);
    }
    console.log('');

    console.log('Stalls:');
    console.log(`   Total: ${createdStalls.length}`);
    const availableCount = await Stall.countDocuments({ status: 'available' });
    const reservedCount = await Stall.countDocuments({ status: 'reserved' });
    const maintenanceCount = await Stall.countDocuments({ status: 'maintenance' });
    console.log(`   - Available: ${availableCount}`);
    console.log(`   - Reserved: ${reservedCount}`);
    console.log(`   - Maintenance: ${maintenanceCount}`);
    console.log(`   - Zones: A, B, C`);
    console.log(`   - Floors: 1, 2`);
    console.log(`   - Stalls per zone/floor: 20\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Database seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(u => {
      console.log(`${u.role.toUpperCase().padEnd(12)}: ${u.email.padEnd(30)} / ${u.password}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

// Run seed
seedAll();
