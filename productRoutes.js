const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const demoStore = require('../utils/demoStore');

const isMongo = () => mongoose.connection.readyState === 1;

/**
 * @route   GET /api/products
 * @desc    Get all available products with optional filtering by category, search text, or featured
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;

    if (isMongo()) {
      const query = { available: true };
      if (category && category !== 'All') query.category = category;
      if (featured === 'true') query.featured = true;
      if (search && search.trim()) {
        const re = { $regex: search.trim(), $options: 'i' };
        query.$or = [{ name: re }, { description: re }];
      }
      const products = await Product.find(query).sort({ featured: -1, createdAt: -1 });
      return res.json({ success: true, count: products.length, data: products, products });
    }

    // In-Memory Demo Fallback
    const query = { available: true };
    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.featured = true;
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    const products = await demoStore.findProducts(query).sort({ featured: -1, createdAt: -1 });
    return res.json({ success: true, count: products.length, data: products, products });
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    if (isMongo()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
      return res.json({ success: true, data: product });
    }

    // Demo store fallback
    const product = await demoStore.findProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    return res.json({ success: true, data: product });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    console.error('GET /products/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
});

module.exports = router;
