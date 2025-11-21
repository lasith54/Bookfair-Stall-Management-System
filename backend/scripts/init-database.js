require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI?.replace('mongodb://mongodb:', 'mongodb://localhost:') 
  || 'mongodb://localhost:27017/bookfair';

const collections = {
  users: {
    indexes: [
      { key: { email: 1 }, options: { unique: true } },
      { key: { role: 1 }, options: {} },
      { key: { isActive: 1 }, options: {} },
      { key: { createdAt: -1 }, options: {} }
    ]
  },
  refreshtokens: {
    indexes: [
      { key: { userId: 1 }, options: {} },
      { key: { token: 1 }, options: { unique: true } },
      { key: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } },
      { key: { isActive: 1 }, options: {} }
    ]
  },
  stalls: {
    indexes: [
      { key: { stallNumber: 1 }, options: { unique: true } },
      { key: { status: 1 }, options: {} },
      { key: { location: 1 }, options: {} },
      { key: { size: 1 }, options: {} },
      { key: { createdAt: -1 }, options: {} }
    ]
  },
  stallcategories: {
    indexes: [
      { key: { name: 1 }, options: { unique: true } },
      { key: { isActive: 1 }, options: {} }
    ]
  },
  reservations: {
    indexes: [
      { key: { userId: 1 }, options: {} },
      { key: { stallId: 1 }, options: {} },
      { key: { status: 1 }, options: {} },
      { key: { startDate: 1, endDate: 1 }, options: {} },
      { key: { createdAt: -1 }, options: {} }
    ]
  },
  notifications: {
    indexes: [
      { key: { userId: 1 }, options: {} },
      { key: { read: 1 }, options: {} },
      { key: { type: 1 }, options: {} },
      { key: { createdAt: -1 }, options: {} }
    ]
  },
  notificationpreferences: {
    indexes: [
      { key: { userId: 1 }, options: { unique: true } }
    ]
  }
};

async function initDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    
    await mongoose.connect(MONGO_URI);
    
    console.log('Connected to MongoDB');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log('');

    const db = mongoose.connection.db;

    // Get existing collections
    const existingCollections = await db.listCollections().toArray();
    const existingCollectionNames = existingCollections.map(c => c.name);

    console.log('Initializing Collections and Indexes...\n');

    for (const [collectionName, config] of Object.entries(collections)) {
      console.log(`${collectionName}`);

      // Create collection if it doesn't exist
      if (!existingCollectionNames.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`   Collection created`);
      } else {
        console.log(`   Collection already exists`);
      }

      // Create indexes
      const collection = db.collection(collectionName);
      
      for (const indexSpec of config.indexes) {
        try {
          await collection.createIndex(indexSpec.key, indexSpec.options);
          const indexName = Object.keys(indexSpec.key).join('_');
          console.log(`   Index: ${indexName}`);
        } catch (error) {
          if (error.code === 85 || error.code === 86) {
            // Index already exists with different options, skip
            const indexName = Object.keys(indexSpec.key).join('_');
            console.log(`   Index: ${indexName} (already exists)`);
          } else {
            throw error;
          }
        }
      }

      console.log('');
    }

    // Display summary
    console.log('Database Summary\n');
    console.log('═══════════════════════════════════════════════════');
    
    for (const collectionName of Object.keys(collections)) {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      const indexes = await collection.indexes();
      
      console.log(`${collectionName.padEnd(25)} │ ${count.toString().padStart(6)} docs │ ${indexes.length} indexes`);
    }
    
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('Database initialization complete!');
    console.log('');
    console.log('Service Collection Ownership:');
    console.log('   Auth Service:         users, refreshtokens');
    console.log('   Stall Service:        stalls, stallcategories');
    console.log('   Reservation Service:  reservations');
    console.log('   Notification Service: notifications, notificationpreferences');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run initialization
initDatabase();
