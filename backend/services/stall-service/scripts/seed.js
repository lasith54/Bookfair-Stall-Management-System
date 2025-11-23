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

// Stall data matching the InteractiveVenueMap.tsx
// SVG dimensions: 40x35 = Small (3x3m), 40x75 = Medium (3x6m), 40x60 = Medium-Large (3x5m)
// SVG dimensions: 100-130x50 = Large (8x4m), 110-125x45 = Extra Large (9x4m)
const getStallsData = () => {
  const baseAmenities = ['Power Outlet', 'Lighting', 'Display Shelves'];
  const premiumAmenities = ['WiFi', 'Storage Cabinet', 'Signage', 'Counter'];
  
  return [
    // LEFT COLUMN (Far Left) - Small & Medium stalls
    { stallNumber: "L1", zone: "L", floor: "Ground", section: "Left Column", position: "Top", width: 3, length: 3, svg: { x: 30, y: 50, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "L2", zone: "L", floor: "Ground", section: "Left Column", position: "Row 2", width: 3, length: 3, svg: { x: 30, y: 90, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "L3", zone: "L", floor: "Ground", section: "Left Column", position: "Row 3", width: 3, length: 3, svg: { x: 30, y: 130, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "L4", zone: "L", floor: "Ground", section: "Left Column", position: "Row 4", width: 3, length: 3, svg: { x: 30, y: 170, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "L5", zone: "L", floor: "Ground", section: "Left Column", position: "Bottom", width: 3, length: 6, svg: { x: 30, y: 210, width: 40, height: 75 }, price: 8000, status: "available" },
    
    // SECTION A (Second from left) - Small & Medium stalls
    { stallNumber: "A1", zone: "A", floor: "Ground", section: "Section A", position: "Top-Left", width: 3, length: 3, svg: { x: 120, y: 50, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "A2", zone: "A", floor: "Ground", section: "Section A", position: "Top-Right", width: 3, length: 3, svg: { x: 165, y: 50, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "A3", zone: "A", floor: "Ground", section: "Section A", position: "Row 2-Left", width: 3, length: 3, svg: { x: 120, y: 90, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "A4", zone: "A", floor: "Ground", section: "Section A", position: "Row 2-Right", width: 3, length: 3, svg: { x: 165, y: 90, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "A5", zone: "A", floor: "Ground", section: "Section A", position: "Row 3-Left", width: 3, length: 3, svg: { x: 120, y: 130, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "A6", zone: "A", floor: "Ground", section: "Section A", position: "Row 3-Right", width: 3, length: 3, svg: { x: 165, y: 130, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "A7", zone: "A", floor: "Ground", section: "Section A", position: "Row 4-Left", width: 3, length: 3, svg: { x: 120, y: 170, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "A8", zone: "A", floor: "Ground", section: "Section A", position: "Row 4-Right", width: 3, length: 3, svg: { x: 165, y: 170, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "A9", zone: "A", floor: "Ground", section: "Section A", position: "Bottom-Left", width: 3, length: 6, svg: { x: 120, y: 210, width: 40, height: 75 }, price: 8000, status: "available" },
    { stallNumber: "A10", zone: "A", floor: "Ground", section: "Section A", position: "Bottom-Right", width: 3, length: 6, svg: { x: 165, y: 210, width: 40, height: 75 }, price: 8000, status: "available" },
    
    // SECTION B (Middle left) - Small & Medium stalls
    { stallNumber: "B1", zone: "B", floor: "Ground", section: "Section B", position: "Top-Left", width: 3, length: 3, svg: { x: 255, y: 50, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "B2", zone: "B", floor: "Ground", section: "Section B", position: "Top-Right", width: 3, length: 3, svg: { x: 300, y: 50, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "B3", zone: "B", floor: "Ground", section: "Section B", position: "Row 2-Left", width: 3, length: 3, svg: { x: 255, y: 90, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "B4", zone: "B", floor: "Ground", section: "Section B", position: "Row 2-Right", width: 3, length: 3, svg: { x: 300, y: 90, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "B5", zone: "B", floor: "Ground", section: "Section B", position: "Row 3-Left", width: 3, length: 3, svg: { x: 255, y: 130, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "B6", zone: "B", floor: "Ground", section: "Section B", position: "Row 3-Right", width: 3, length: 3, svg: { x: 300, y: 130, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "B7", zone: "B", floor: "Ground", section: "Section B", position: "Row 4-Left", width: 3, length: 3, svg: { x: 255, y: 170, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "B8", zone: "B", floor: "Ground", section: "Section B", position: "Row 4-Right", width: 3, length: 3, svg: { x: 300, y: 170, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "B9", zone: "B", floor: "Ground", section: "Section B", position: "Bottom-Left", width: 3, length: 6, svg: { x: 255, y: 210, width: 40, height: 75 }, price: 8500, status: "available" },
    { stallNumber: "B10", zone: "B", floor: "Ground", section: "Section B", position: "Bottom-Right", width: 3, length: 6, svg: { x: 300, y: 210, width: 40, height: 75 }, price: 8500, status: "available" },
    
    // SECTION C (Middle right) - Small & Medium stalls
    { stallNumber: "C1", zone: "C", floor: "Ground", section: "Section C", position: "Top-Left", width: 3, length: 3, svg: { x: 390, y: 50, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "C2", zone: "C", floor: "Ground", section: "Section C", position: "Top-Right", width: 3, length: 3, svg: { x: 435, y: 50, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "C3", zone: "C", floor: "Ground", section: "Section C", position: "Row 2-Left", width: 3, length: 3, svg: { x: 390, y: 90, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "C4", zone: "C", floor: "Ground", section: "Section C", position: "Row 2-Right", width: 3, length: 3, svg: { x: 435, y: 90, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "C5", zone: "C", floor: "Ground", section: "Section C", position: "Row 3-Left", width: 3, length: 3, svg: { x: 390, y: 130, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "C6", zone: "C", floor: "Ground", section: "Section C", position: "Row 3-Right", width: 3, length: 3, svg: { x: 435, y: 130, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "C7", zone: "C", floor: "Ground", section: "Section C", position: "Row 4-Left", width: 3, length: 3, svg: { x: 390, y: 170, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "C8", zone: "C", floor: "Ground", section: "Section C", position: "Row 4-Right", width: 3, length: 3, svg: { x: 435, y: 170, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "C9", zone: "C", floor: "Ground", section: "Section C", position: "Bottom-Left", width: 3, length: 6, svg: { x: 390, y: 210, width: 40, height: 75 }, price: 8500, status: "available" },
    { stallNumber: "C10", zone: "C", floor: "Ground", section: "Section C", position: "Bottom-Right", width: 3, length: 6, svg: { x: 435, y: 210, width: 40, height: 75 }, price: 8500, status: "available" },
    
    // RIGHT COLUMN (Far Right) - Small & Medium stalls
    { stallNumber: "R1", zone: "R", floor: "Ground", section: "Right Column", position: "Top", width: 3, length: 3, svg: { x: 525, y: 50, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "R2", zone: "R", floor: "Ground", section: "Right Column", position: "Row 2", width: 3, length: 3, svg: { x: 525, y: 90, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "R3", zone: "R", floor: "Ground", section: "Right Column", position: "Row 3", width: 3, length: 3, svg: { x: 525, y: 130, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "R4", zone: "R", floor: "Ground", section: "Right Column", position: "Row 4", width: 3, length: 3, svg: { x: 525, y: 170, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "R5", zone: "R", floor: "Ground", section: "Right Column", position: "Bottom", width: 3, length: 6, svg: { x: 525, y: 210, width: 40, height: 75 }, price: 8000, status: "available" },
    
    // MIDDLE HORIZONTAL SECTION - Large Premium Stalls
    { stallNumber: "M1", zone: "M", floor: "Ground", section: "Middle Zone", position: "Center-Left", width: 8, length: 4, svg: { x: 55, y: 305, width: 120, height: 50 }, price: 12000, status: "available" },
    { stallNumber: "M2", zone: "M", floor: "Ground", section: "Middle Zone", position: "Center", width: 7, length: 4, svg: { x: 185, y: 305, width: 100, height: 50 }, price: 11000, status: "available" },
    { stallNumber: "M3", zone: "M", floor: "Ground", section: "Middle Zone", position: "Center-Right", width: 7.5, length: 4, svg: { x: 295, y: 305, width: 110, height: 50 }, price: 11500, status: "available" },
    { stallNumber: "M4", zone: "M", floor: "Ground", section: "Middle Zone", position: "Right", width: 8.5, length: 4, svg: { x: 415, y: 305, width: 130, height: 50 }, price: 12500, status: "available" },
    
    // LOWER HORIZONTAL SECTION - Extra Large Premium Stalls
    { stallNumber: "X1", zone: "X", floor: "Ground", section: "Premium Zone", position: "Left", width: 9, length: 4, svg: { x: 45, y: 370, width: 110, height: 45 }, price: 13000, status: "available" },
    { stallNumber: "X2", zone: "X", floor: "Ground", section: "Premium Zone", position: "Center-Left", width: 9, length: 4, svg: { x: 165, y: 370, width: 110, height: 45 }, price: 13000, status: "available" },
    { stallNumber: "X3", zone: "X", floor: "Ground", section: "Premium Zone", position: "Center-Right", width: 9, length: 4, svg: { x: 285, y: 370, width: 110, height: 45 }, price: 13000, status: "available" },
    { stallNumber: "X4", zone: "X", floor: "Ground", section: "Premium Zone", position: "Right", width: 10, length: 4, svg: { x: 405, y: 370, width: 125, height: 45 }, price: 14000, status: "available" },
    
    // BOTTOM LEFT COLUMN - Small & Medium stalls
    { stallNumber: "BL1", zone: "BL", floor: "Ground", section: "Bottom-Left", position: "Top", width: 3, length: 5, svg: { x: 30, y: 440, width: 40, height: 60 }, price: 7000, status: "available" },
    { stallNumber: "BL2", zone: "BL", floor: "Ground", section: "Bottom-Left", position: "Row 2", width: 3, length: 3, svg: { x: 30, y: 505, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "BL3", zone: "BL", floor: "Ground", section: "Bottom-Left", position: "Row 3", width: 3, length: 3, svg: { x: 30, y: 545, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "BL4", zone: "BL", floor: "Ground", section: "Bottom-Left", position: "Row 4", width: 3, length: 3, svg: { x: 30, y: 585, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "BL5", zone: "BL", floor: "Ground", section: "Bottom-Left", position: "Bottom", width: 3, length: 3, svg: { x: 30, y: 625, width: 40, height: 35 }, price: 5000, status: "available" },
    
    // SECTION D (Second from left) - Bottom Row
    { stallNumber: "D1", zone: "D", floor: "Ground", section: "Section D", position: "Top-Left", width: 3, length: 5, svg: { x: 120, y: 440, width: 40, height: 60 }, price: 7000, status: "available" },
    { stallNumber: "D2", zone: "D", floor: "Ground", section: "Section D", position: "Top-Right", width: 3, length: 3, svg: { x: 165, y: 440, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "D3", zone: "D", floor: "Ground", section: "Section D", position: "Row 2-Left", width: 3, length: 3, svg: { x: 120, y: 505, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "D4", zone: "D", floor: "Ground", section: "Section D", position: "Row 2-Right", width: 3, length: 3, svg: { x: 165, y: 505, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "D5", zone: "D", floor: "Ground", section: "Section D", position: "Row 3-Left", width: 3, length: 3, svg: { x: 120, y: 545, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "D6", zone: "D", floor: "Ground", section: "Section D", position: "Row 3-Right", width: 3, length: 3, svg: { x: 165, y: 545, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "D7", zone: "D", floor: "Ground", section: "Section D", position: "Row 4-Left", width: 3, length: 3, svg: { x: 120, y: 585, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "D8", zone: "D", floor: "Ground", section: "Section D", position: "Row 4-Right", width: 3, length: 3, svg: { x: 165, y: 585, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "D9", zone: "D", floor: "Ground", section: "Section D", position: "Bottom-Left", width: 3, length: 3, svg: { x: 120, y: 625, width: 40, height: 35 }, price: 5500, status: "available" },
    { stallNumber: "D10", zone: "D", floor: "Ground", section: "Section D", position: "Bottom-Right", width: 3, length: 3, svg: { x: 165, y: 625, width: 40, height: 35 }, price: 5500, status: "available" },
    
    // SECTION E (Middle left) - Bottom Row
    { stallNumber: "E1", zone: "E", floor: "Ground", section: "Section E", position: "Top-Left", width: 3, length: 5, svg: { x: 255, y: 440, width: 40, height: 60 }, price: 7500, status: "available" },
    { stallNumber: "E2", zone: "E", floor: "Ground", section: "Section E", position: "Top-Right", width: 3, length: 3, svg: { x: 300, y: 440, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "E3", zone: "E", floor: "Ground", section: "Section E", position: "Row 2-Left", width: 3, length: 3, svg: { x: 255, y: 505, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "E4", zone: "E", floor: "Ground", section: "Section E", position: "Row 2-Right", width: 3, length: 3, svg: { x: 300, y: 505, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "E5", zone: "E", floor: "Ground", section: "Section E", position: "Row 3-Left", width: 3, length: 3, svg: { x: 255, y: 545, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "E6", zone: "E", floor: "Ground", section: "Section E", position: "Row 3-Right", width: 3, length: 3, svg: { x: 300, y: 545, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "E7", zone: "E", floor: "Ground", section: "Section E", position: "Row 4-Left", width: 3, length: 3, svg: { x: 255, y: 585, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "E8", zone: "E", floor: "Ground", section: "Section E", position: "Row 4-Right", width: 3, length: 3, svg: { x: 300, y: 585, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "E9", zone: "E", floor: "Ground", section: "Section E", position: "Bottom-Left", width: 3, length: 3, svg: { x: 255, y: 625, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "E10", zone: "E", floor: "Ground", section: "Section E", position: "Bottom-Right", width: 3, length: 3, svg: { x: 300, y: 625, width: 40, height: 35 }, price: 6000, status: "available" },
    
    // SECTION F (Middle right) - Bottom Row
    { stallNumber: "F1", zone: "F", floor: "Ground", section: "Section F", position: "Top-Left", width: 3, length: 5, svg: { x: 390, y: 440, width: 40, height: 60 }, price: 7500, status: "available" },
    { stallNumber: "F2", zone: "F", floor: "Ground", section: "Section F", position: "Top-Right", width: 3, length: 3, svg: { x: 435, y: 440, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "F3", zone: "F", floor: "Ground", section: "Section F", position: "Row 2-Left", width: 3, length: 3, svg: { x: 390, y: 505, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "F4", zone: "F", floor: "Ground", section: "Section F", position: "Row 2-Right", width: 3, length: 3, svg: { x: 435, y: 505, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "F5", zone: "F", floor: "Ground", section: "Section F", position: "Row 3-Left", width: 3, length: 3, svg: { x: 390, y: 545, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "F6", zone: "F", floor: "Ground", section: "Section F", position: "Row 3-Right", width: 3, length: 3, svg: { x: 435, y: 545, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "F7", zone: "F", floor: "Ground", section: "Section F", position: "Row 4-Left", width: 3, length: 3, svg: { x: 390, y: 585, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "F8", zone: "F", floor: "Ground", section: "Section F", position: "Row 4-Right", width: 3, length: 3, svg: { x: 435, y: 585, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "F9", zone: "F", floor: "Ground", section: "Section F", position: "Bottom-Left", width: 3, length: 3, svg: { x: 390, y: 625, width: 40, height: 35 }, price: 6000, status: "available" },
    { stallNumber: "F10", zone: "F", floor: "Ground", section: "Section F", position: "Bottom-Right", width: 3, length: 3, svg: { x: 435, y: 625, width: 40, height: 35 }, price: 6000, status: "available" },
    
    // BOTTOM RIGHT COLUMN - Small & Medium stalls
    { stallNumber: "BR1", zone: "BR", floor: "Ground", section: "Bottom-Right", position: "Top", width: 3, length: 5, svg: { x: 525, y: 440, width: 40, height: 60 }, price: 7000, status: "available" },
    { stallNumber: "BR2", zone: "BR", floor: "Ground", section: "Bottom-Right", position: "Row 2", width: 3, length: 3, svg: { x: 525, y: 505, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "BR3", zone: "BR", floor: "Ground", section: "Bottom-Right", position: "Row 3", width: 3, length: 3, svg: { x: 525, y: 545, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "BR4", zone: "BR", floor: "Ground", section: "Bottom-Right", position: "Row 4", width: 3, length: 3, svg: { x: 525, y: 585, width: 40, height: 35 }, price: 5000, status: "available" },
    { stallNumber: "BR5", zone: "BR", floor: "Ground", section: "Bottom-Right", position: "Bottom", width: 3, length: 3, svg: { x: 525, y: 625, width: 40, height: 35 }, price: 5000, status: "available" },
  ];
};

const generateStalls = (defaultCategoryId) => {
  const stallsData = getStallsData();
  const baseAmenities = ['Power Outlet', 'Lighting', 'Display Shelves'];
  const premiumAmenities = ['WiFi', 'Storage Cabinet', 'Signage', 'Counter'];
  
  return stallsData.map(stall => {
    // Determine amenities based on price
    let amenities = [...baseAmenities];
    if (stall.price >= 10000) {
      amenities = [...baseAmenities, ...premiumAmenities];
    } else if (stall.price >= 7000) {
      amenities = [...baseAmenities, 'WiFi', 'Counter'];
    } else if (stall.price >= 6000) {
      amenities = [...baseAmenities, 'Counter'];
    }
    
    // Determine features based on stall size and price
    const isPremium = stall.price >= 10000;
    const area = stall.width * stall.length;
    
    return {
      stallNumber: stall.stallNumber,
      location: {
        zone: stall.zone,
        floor: stall.floor,
        section: stall.section,
        position: stall.position
      },
      dimensions: {
        width: stall.width,
        length: stall.length,
        height: 3
      },
      category: defaultCategoryId,
      pricing: {
        basePrice: stall.price,
        currency: 'LKR',
        pricingModel: 'per_day'
      },
      amenities,
      features: {
        hasElectricity: true,
        hasWifi: isPremium || stall.price >= 7000,
        hasStorage: isPremium || area >= 15,
        hasDisplay: true
      },
      capacity: {
        maxOccupants: Math.ceil(area / 4), // 1 person per 4 sqm
        maxItems: Math.floor(area * 2) // Based on area
      },
      status: stall.status,
      notes: JSON.stringify({ svg: stall.svg }),
      isActive: true
    };
  });
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

    // Use "Books" category as default for all stalls
    const defaultCategory = createdCategories.find(cat => cat.name === 'Books');

    // Generate and create stalls with default category
    console.log('Generating stalls from InteractiveVenueMap layout...');
    const stallsData = generateStalls(defaultCategory._id);
    
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
    
    // Stall size breakdown
    const smallStalls = await Stall.countDocuments({ 'dimensions.width': 3, 'dimensions.length': 3 });
    const mediumStalls = await Stall.countDocuments({ 'dimensions.width': 3, 'dimensions.length': { $gte: 5 } });
    const largeStalls = await Stall.countDocuments({ 'dimensions.width': { $gte: 7 } });
    
    console.log(`\nStall Size Breakdown:`);
    console.log(`  Small (3x3m): ${smallStalls}`);
    console.log(`  Medium (3x5-6m): ${mediumStalls}`);
    console.log(`  Large (7-10x4m): ${largeStalls}`);
    
    // Price range breakdown
    const budget = await Stall.countDocuments({ 'pricing.basePrice': { $lte: 5500 } });
    const standard = await Stall.countDocuments({ 'pricing.basePrice': { $gt: 5500, $lte: 8500 } });
    const premium = await Stall.countDocuments({ 'pricing.basePrice': { $gt: 8500 } });
    
    console.log(`\nPrice Range Breakdown:`);
    console.log(`  Budget (≤5,500 LKR): ${budget}`);
    console.log(`  Standard (5,501-8,500 LKR): ${standard}`);
    console.log(`  Premium (>8,500 LKR): ${premium}`);
    
    console.log(`\nZones: L, A, B, C, R, M, X, BL, D, E, F, BR`);
    console.log(`Note: All stalls have SVG coordinates stored in notes field`);
    console.log(`Note: Category can be assigned after reservation`);

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
