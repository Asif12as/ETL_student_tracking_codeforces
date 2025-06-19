import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cron from 'node-cron';

// Import routes
import studentRoutes from './routes/students.js';
import codeforcesRoutes from './routes/codeforces.js';
import analyticsRoutes from './routes/analytics.js';

// Import services
import { syncAllStudentsData } from './services/codeforcesService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codetracker')
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/codeforces', codeforcesRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Schedule automatic data sync every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('🔄 Starting scheduled Codeforces data sync...');
  try {
    await syncAllStudentsData();
    console.log('✅ Scheduled sync completed successfully');
  } catch (error) {
    console.error('❌ Scheduled sync failed:', error);
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});