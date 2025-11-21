require('dotenv').config();
const mongoose = require('mongoose');
const Stall = require('../src/models/Stall');
const StallCategory = require('../src/models/StallCategory');

// Use the MONGO_URI from environment or default
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bookfair';

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

const zones = ['A', 'B', 'C'];
const floors = ['1', '2'];

const generateStalls = (categoryIds) => {
  const stalls = [];
  let stallCounter = 1;

  zones.forEach(zone => {
    floors.forEach(floor => {
      // Create 20 stalls per zone-floor combination (3 zones * 2 floors * 20 = 120 stalls)
      for (let i = 1; i <= 20; i++) {
        const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
        const basePrice = 5000 + Math.floor(Math.random() * 10000); // Random price between 5000-15000
        
        // Vary dimensions
        const widths = [8, 10, 12];
        const lengths = [8, 10, 12];
        const width = widths[Math.floor(Math.random() * widths.length)];
        const length = lengths[Math.floor(Math.random() * lengths.length)];

        // Vary amenities
        const possibleAmenities = ['Display Shelves', 'Counter', 'Storage Cabinet', 'Signage', 'Lighting'];
        const amenityCount = Math.floor(Math.random() * 3) + 2; // 2-4 amenities
        const amenities = [];
        for (let j = 0; j < amenityCount; j++) {
          const amenity = possibleAmenities[Math.floor(Math.random() * possibleAmenities.length)];
          if (!amenities.includes(amenity)) {
            amenities.push(amenity);
          }
        }

        // Determine section based on position
        const section = i <= 10 ? 'Front' : 'Back';
        const position = `Row ${Math.ceil(i / 5)}`;

        // Vary status - most available, some reserved
        let status = 'available';
        if (Math.random() < 0.15) { // 15% reserved
          status = 'reserved';
        } else if (Math.random() < 0.05) { // 5% maintenance
          status = 'maintenance';
        }

        stalls.push({
          stallNumber: `${zone}${floor}-${String(i).padStart(3, '0')}`,
          location: {
            zone,
            floor,
            section,
            position
          },
          dimensions: {
            width,
            length,
            height: 3
          },
          category: categoryId,
          pricing: {
            basePrice,
            currency: 'LKR',
            pricingModel: 'per_day'
          },
          amenities,
          features: {
            hasElectricity: true,
            hasWifi: Math.random() > 0.5, // 50% have wifi
            hasStorage: Math.random() > 0.3, // 70% have storage
            hasDisplay: Math.random() > 0.2 // 80% have display
          },
          capacity: {
            maxOccupants: Math.floor(Math.random() * 3) + 2, // 2-4 occupants
            maxItems: Math.floor((width * length) / 2) // Based on area
          },
          status,
          notes: status === 'maintenance' ? 'Under maintenance - will be available soon' : '',
          isActive: true
        });

        stallCounter++;
      }
    });
  });

  return stalls;
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing stalls and categories...');
    await Stall.deleteMany({});
    await StallCategory.deleteMany({});

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await StallCategory.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Get category IDs
    const categoryIds = createdCategories.map(cat => cat._id);

    // Generate and create stalls
    console.log('Generating stalls...');
    const stallsData = generateStalls(categoryIds);
    
    console.log('Creating stalls in database...');
    const createdStalls = await Stall.insertMany(stallsData);
    console.log(`Created ${createdStalls.length} stalls`);

    // Print summary
    console.log('\n=== Seed Summary ===');
    console.log(`Total Categories: ${createdCategories.length}`);
    console.log(`Total Stalls: ${createdStalls.length}`);
    
    const availableCount = await Stall.countDocuments({ status: 'available' });
    const reservedCount = await Stall.countDocuments({ status: 'reserved' });
    const maintenanceCount = await Stall.countDocuments({ status: 'maintenance' });
    
    console.log(`\nStall Status Breakdown:`);
    console.log(`  Available: ${availableCount}`);
    console.log(`  Reserved: ${reservedCount}`);
    console.log(`  Maintenance: ${maintenanceCount}`);
    
    console.log(`\nZones: ${zones.join(', ')}`);
    console.log(`Floors: ${floors.join(', ')}`);
    console.log(`Stalls per zone-floor: 20`);

    // Print category breakdown
    console.log(`\nStalls by Category:`);
    for (const category of createdCategories) {
      const count = await Stall.countDocuments({ category: category._id });
      console.log(`  ${category.name}: ${count}`);
    }

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
