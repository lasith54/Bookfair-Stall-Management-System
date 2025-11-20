const mongoose = require('mongoose');
require('dotenv').config();

const Notification = require('../src/models/Notification');
const NotificationPreference = require('../src/models/NotificationPreference');
const QRCode = require('../src/models/QRCode');

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Notification.deleteMany({});
    await NotificationPreference.deleteMany({});
    await QRCode.deleteMany({});

    console.log('Database seeded successfully');
    console.log('Note: Notifications, preferences, and QR codes will be created automatically by the system');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
