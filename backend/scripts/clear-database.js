require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI?.replace('mongodb://mongodb:', 'mongodb://localhost:') 
  || 'mongodb://localhost:27017/bookfair';

async function clearDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}\n`);
    
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log(' Database is already empty\n');
      process.exit(0);
    }

    console.log('Clearing all collections...\n');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const result = await db.collection(collectionName).deleteMany({});
      console.log(`   ${collectionName.padEnd(25)} - Deleted ${result.deletedCount} documents`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database cleared successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 Next steps:');
    console.log('   - Run "npm run db:seed" to populate with sample data');
    console.log('   - Or use the application to create new data\n');

    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();
