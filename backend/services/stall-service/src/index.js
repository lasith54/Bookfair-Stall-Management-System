require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const stallRoutes = require('./routes/stallRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const internalRoutes = require('./routes/internalRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/stalls', stallRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/internal', internalRoutes); // Internal service-to-service routes

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Stall service is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Stall service running on port ${PORT}`);
});

module.exports = app;
