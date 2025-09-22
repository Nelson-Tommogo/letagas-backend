require('dotenv').config();
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import connectDB from './config/database';

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'LetaGas API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders').default);
app.use('/api/categories', require('./routes/categories').default);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});