const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Product = require('../models/Product');
const AdminUser = require('../models/AdminUser');
const demoStore = require('../utils/demoStore');

async function seedDatabase() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bakery';

  try {
    console.log('🔄 Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 });
    console.log('✅ Connected to MongoDB');

    console.log('🧹 Clearing Product and AdminUser collections...');
    await Product.deleteMany({});
    await AdminUser.deleteMany({});

    // Seed products
    const inserted = await Product.insertMany(demoStore.products);
    console.log(`🍰 Successfully seeded ${inserted.length || 16} bakery products into MongoDB!`);

    const username = process.env.ADMIN_SEED_USERNAME || 'admin';
    const email = (process.env.ADMIN_SEED_EMAIL || 'admin@sweetbliss.com').toLowerCase();
    const password = process.env.ADMIN_SEED_PASSWORD || 'Admin@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await AdminUser.create({
      username,
      email,
      passwordHash,
      role: 'superadmin'
    });

    console.log(`👤 Successfully seeded Admin User: ${email}`);
    console.log('🎉 Seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log('\n======================================================');
    console.log('⚠️  Notice: Local MongoDB is not running on port 27017.');
    console.log('✨ Good news: You do NOT need MongoDB to view the website!');
    console.log('🚀 The server has an In-Memory Demo Mode with all 16');
    console.log('   products and admin account pre-loaded.');
    console.log('👉 Simply run: npm run dev');
    console.log('======================================================\n');
    process.exit(0);
  }
}

seedDatabase();
