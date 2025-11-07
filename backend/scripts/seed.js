const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookfair', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema (simplified for seeding)
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  businessName: String,
  contactNumber: String,
  address: String,
  role: String,
  isVerified: Boolean,
  isActive: Boolean,
});

const User = mongoose.model('User', userSchema);

const seedUsers = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing users
    await User.deleteMany({});
    console.log('✅ Cleared existing users');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create sample users
    const users = [
      {
        email: 'vendor1@test.com',
        password: hashedPassword,
        name: 'John Doe',
        businessName: 'Doe Books & Publishers',
        contactNumber: '0771234567',
        address: '123, Main Street, Colombo',
        role: 'vendor',
        isVerified: true,
        isActive: true,
      },
      {
        email: 'publisher1@test.com',
        password: hashedPassword,
        name: 'Jane Smith',
        businessName: 'Smith Publishing House',
        contactNumber: '0777654321',
        address: '456, Lake Road, Kandy',
        role: 'publisher',
        isVerified: true,
        isActive: true,
      },
      {
        email: 'employee1@test.com',
        password: hashedPassword,
        name: 'Admin User',
        businessName: null,
        contactNumber: '0761234567',
        address: null,
        role: 'employee',
        isVerified: true,
        isActive: true,
      },
      {
        email: 'admin@bookfair.lk',
        password: hashedPassword,
        name: 'System Admin',
        businessName: null,
        contactNumber: '0751234567',
        address: null,
        role: 'admin',
        isVerified: true,
        isActive: true,
      },
    ];

    await User.insertMany(users);
    console.log('✅ Created sample users:');
    console.log('   - vendor1@test.com (password: password123)');
    console.log('   - publisher1@test.com (password: password123)');
    console.log('   - employee1@test.com (password: password123)');
    console.log('   - admin@bookfair.lk (password: password123)');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
