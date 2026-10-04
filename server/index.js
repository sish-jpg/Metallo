import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedData.js';
import { Furnace } from './models/Furnace.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[HTTP] ${req.method} ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'METALLO Industrial Optimization Platform'
  });
});

// Serve frontend static build in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Fallback to client SPA for non-API routes
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.url.startsWith('/api')) return next();
  const indexPath = path.join(clientDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start Server
async function start() {
  await connectDB();

  // Auto-seed if database is empty
  const furnaceCount = await Furnace.countDocuments();
  if (furnaceCount === 0) {
    console.log('[METALLO] Database empty. Running initial demo seed...');
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  METALLO Energy & Process Optimization Server`);
    console.log(`  API Active: http://localhost:${PORT}/api`);
    console.log(`  Health Check: http://localhost:${PORT}/health`);
    console.log(`  Full Application UI: http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

start().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
