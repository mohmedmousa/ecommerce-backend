// server.js
const express = require('express');     // Import Express framework
const mongoose = require('mongoose');   // Import Mongoose to connect to MongoDB
const dotenv = require('dotenv');       // To load environment variables
const cors = require('cors');           // Allow requests from frontend
const morgan = require('morgan');       // Logs every HTTP request

dotenv.config();                        // Load variables from .env file

const app = express();                  // Create Express app

// Middleware
app.use(express.json());                // Parse incoming JSON requests
app.use(cors());                        // Enable CORS
app.use(morgan('dev'));                 // Log requests

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling Middleware

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);      // أي Route مش متعرف
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// use databade file
const connectDB= require('./config/db')
dotenv.config()
connectDB()

