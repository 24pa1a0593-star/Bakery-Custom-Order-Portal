require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Flexible CORS allowing frontend running on any localhost port (5173, 5174, 3000, etc.)
app.use(cors({
  origin: (origin, callback) => {
    // If no origin (e.g. mobile apps, curl, Postman), allow it
    if (!origin) return callback(null, true);

    const allowedUrl = process.env.FRONTEND_URL;
    if (allowedUrl && origin === allowedUrl) return callback(null, true);

    // Allow any localhost or 127.0.0.1 origin
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Default allow for development flexibility
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  const isMongo = mongoose.connection.readyState === 1;
  res.json({
    success: true,
    message: isMongo
      ? '🎂 Sweet Bliss Bakery API is running! (Connected to MongoDB)'
      : '🎂 Sweet Bliss Bakery API is running in DEMO MODE (In-Memory Database)',
    database: isMongo ? 'MongoDB' : 'In-Memory Demo Database',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bakery';

function startServer(isDemo = false, portToUse = PORT) {
  const server = app.listen(portToUse, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Sweet Bliss Bakery API running on http://localhost:${portToUse}`);
    if (isDemo) {
      console.log(`⚠️  Status: Running in DEMO MODE (In-Memory Database)`);
      console.log(`🍰 Preloaded 16 signature bakery products`);
      console.log(`👤 Admin login: admin@sweetbliss.com / Admin@123`);
      console.log(`💡 To connect MongoDB Atlas, set MONGO_URI in .env`);
    } else {
      console.log(`✅ Status: Connected to MongoDB database`);
    }
    console.log(`🌐 CORS: Allowed for any localhost / 127.0.0.1 port`);
    console.log(`==================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
      console.warn(`⚠️ Port ${portToUse} not available (${err.message}). Trying port ${portToUse + 1}...`);
      startServer(isDemo, portToUse + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

// Attempt to connect to MongoDB; fallback to Demo Mode if offline
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    startServer(false);
  })
  .catch(err => {
    console.log(`⚠️ MongoDB offline (${err.message}). Activating In-Memory Demo Mode...`);
    startServer(true);
  });
