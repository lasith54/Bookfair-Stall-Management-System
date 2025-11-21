require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI?.replace('mongodb://mongodb:', 'mongodb://localhost:') 
  || 'mongodb://localhost:27017/bookfair';

async function showDatabaseStatus() {
  try {
    console.log('Connecting to MongoDB...\n');
    
    await mongoose.connect(MONGO_URI);
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;

    console.log('═══════════════════════════════════════════════════');
    console.log(`DATABASE STATUS - ${dbName}`);
    console.log('═══════════════════════════════════════════════════\n');

    // Database stats
    const dbStats = await db.stats();
    console.log('Database Overview:');
    console.log(`   Size: ${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Storage: ${(dbStats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Indexes: ${(dbStats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Collections: ${dbStats.collections}`);
    console.log(`   Objects: ${dbStats.objects}`);
    console.log('');

    // List all collections
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('No collections found. Run init-database.js first.\n');
      process.exit(0);
    }

    console.log('📋 Collections:\n');
    console.log('Collection Name          │  Documents │ Avg Size │  Indexes │ Service Owner');
    console.log('─────────────────────────┼────────────┼──────────┼──────────┼─────────────────────');

    const serviceOwnership = {
      users: 'Auth Service',
      refreshtokens: 'Auth Service',
      stalls: 'Stall Service',
      stallcategories: 'Stall Service',
      reservations: 'Reservation Service',
      notifications: 'Notification Service',
      notificationpreferences: 'Notification Service'
    };

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      
      const stats = await db.command({ collStats: collectionName }).catch(() => ({
        count: 0,
        avgObjSize: 0,
        nindexes: 0
      }));
      
      const owner = serviceOwnership[collectionName] || 'Unknown';
      
      const count = stats.count || 0;
      const avgSize = stats.avgObjSize || 0;
      const indexCount = stats.nindexes || 0;
      
      console.log(
        `${collectionName.padEnd(24)} │ ` +
        `${count.toString().padStart(10)} │ ` +
        `${avgSize.toString().padStart(7)}B │ ` +
        `${indexCount.toString().padStart(8)} │ ` +
        `${owner}`
      );
    }

    console.log('─────────────────────────┴────────────┴──────────┴──────────┴─────────────────────\n');

    // Show indexes for each collection
    console.log('Indexes:\n');
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      const indexes = await collection.indexes();
      
      if (indexes.length > 0) {
        console.log(`   ${collectionName}:`);
        indexes.forEach(index => {
          const keys = Object.keys(index.key).map(k => {
            const direction = index.key[k] === 1 ? '↑' : index.key[k] === -1 ? '↓' : '';
            return `${k}${direction}`;
          }).join(', ');
          
          const unique = index.unique ? ' [UNIQUE]' : '';
          const ttl = index.expireAfterSeconds !== undefined ? ` [TTL: ${index.expireAfterSeconds}s]` : '';
          
          console.log(`      • ${index.name}: ${keys}${unique}${ttl}`);
        });
        console.log('');
      }
    }

    // Connection info
    console.log('🔗 Connection Info:');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Port: ${mongoose.connection.port}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Ready State: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
    console.log('');

    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run status check
showDatabaseStatus();
