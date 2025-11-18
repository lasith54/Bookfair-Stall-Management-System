require('dotenv').config();
const mongoose = require('mongoose');
const Reservation = require('../src/models/Reservation');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const sampleReservations = [
  {
    userId: null, // Will be set from existing users
    stallId: null, // Will be set from existing stalls
    reservationNumber: 'RES-2025-0001',
    startDate: new Date('2025-12-01'),
    endDate: new Date('2025-12-05'),
    duration: 4,
    basePrice: 10000,
    totalAmount: 40000,
    remainingAmount: 40000,
    paidAmount: 0,
    paymentStatus: 'pending',
    status: 'pending',
    purpose: 'Book sale and author signing event for new releases',
    specialRequests: 'Need extra electrical outlets for lighting',
    submittedAt: new Date()
  },
  {
    userId: null,
    stallId: null,
    reservationNumber: 'RES-2025-0002',
    startDate: new Date('2025-12-10'),
    endDate: new Date('2025-12-15'),
    duration: 5,
    basePrice: 12000,
    totalAmount: 60000,
    remainingAmount: 30000,
    paidAmount: 30000,
    paymentStatus: 'partial',
    status: 'approved',
    purpose: 'Publishing house showcase and book distribution',
    approvedAt: new Date(),
    paymentDeadline: new Date('2025-11-25'),
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    userId: null,
    stallId: null,
    reservationNumber: 'RES-2025-0003',
    startDate: new Date('2025-12-01'),
    endDate: new Date('2025-12-03'),
    duration: 2,
    basePrice: 8000,
    discount: {
      type: 'percentage',
      value: 10,
      reason: 'Early bird discount'
    },
    totalAmount: 14400, // 8000 * 2 * 0.9
    remainingAmount: 0,
    paidAmount: 14400,
    paymentStatus: 'paid',
    status: 'confirmed',
    purpose: 'Children\'s book festival and reading sessions',
    approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    paymentDeadline: new Date('2025-11-20'),
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
];

const seedReservations = async () => {
  try {
    await connectDB();

    // Clear existing reservations (optional - comment out if you want to keep existing data)
    // await Reservation.deleteMany({});
    // console.log('Cleared existing reservations');

    // Get sample users and stalls from the database
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Stall = mongoose.model('Stall', new mongoose.Schema({}, { strict: false }));

    const users = await User.find({ role: 'vendor' }).limit(3);
    const stalls = await Stall.find({ status: 'available' }).limit(3);

    if (users.length === 0) {
      console.log('No users found. Please seed users first.');
      process.exit(1);
    }

    if (stalls.length === 0) {
      console.log('No stalls found. Please seed stalls first.');
      process.exit(1);
    }

    // Assign users and stalls to reservations
    sampleReservations[0].userId = users[0]._id;
    sampleReservations[0].stallId = stalls[0]._id;
    
    if (users.length > 1 && stalls.length > 1) {
      sampleReservations[1].userId = users[1]._id;
      sampleReservations[1].stallId = stalls[1]._id;
      
      // Set approvedBy to an admin user if available
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        sampleReservations[1].approvedBy = admin._id;
        sampleReservations[2].approvedBy = admin._id;
      }
    }
    
    if (users.length > 2 && stalls.length > 2) {
      sampleReservations[2].userId = users[2]._id;
      sampleReservations[2].stallId = stalls[2]._id;
    }

    // Create reservations
    const createdReservations = await Reservation.insertMany(sampleReservations);
    
    console.log(`\n✅ Successfully seeded ${createdReservations.length} reservations`);
    console.log('\nSample Reservations:');
    createdReservations.forEach(reservation => {
      console.log(`- ${reservation.reservationNumber} (${reservation.status})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedReservations();
