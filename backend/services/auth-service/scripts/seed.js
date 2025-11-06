require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const USER_ROLES = {
  VENDOR: 'vendor',
  PUBLISHER: 'publisher',
  EMPLOYEE: 'employee',
  ADMIN: 'admin'
};

const testUsers = [
  {
    email: 'admin@bookfair.com',
    password: 'Admin@123',
    name: 'Admin User',
    contactNumber: '+94700000000',
    role: USER_ROLES.ADMIN,
    isVerified: true,
    isActive: true
  },
  {
    email: 'employee@bookfair.com',
    password: 'Employee@123',
    name: 'Employee User',
    contactNumber: '+94700000001',
    role: USER_ROLES.EMPLOYEE,
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
    role: USER_ROLES.VENDOR,
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
    role: USER_ROLES.PUBLISHER,
    isVerified: true,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create test users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created ${user.role}: ${user.email}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
