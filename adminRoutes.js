const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ContactMessage = require('../models/ContactMessage');
const demoStore = require('../utils/demoStore');
const authMiddleware = require('../middleware/authMiddleware');

const isMongo = () => mongoose.connection.readyState === 1;

// Protect all admin routes
router.use(authMiddleware);

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders with pagination and status filter
 * @access  Private (Admin)
 */
router.get('/orders', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }

    let total = 0;
    let orders = [];

    if (isMongo()) {
      total = await Order.countDocuments(filter);
      orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      total = await demoStore.countOrders(filter);
      orders = await demoStore.findOrders(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    res.json({
      success: true,
      count: orders.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: orders
    });
  } catch (err) {
    console.error('GET /admin/orders error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get a single order by ID
 * @access  Private (Admin)
 */
router.get('/orders/:id', async (req, res) => {
  try {
    let order = null;
    if (isMongo()) {
      order = await Order.findById(req.params.id);
    } else {
      order = await demoStore.findOrderById(req.params.id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid order ID format.' });
    }
    console.error('GET /admin/orders/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch order.' });
  }
});

/**
 * @route   PATCH /api/admin/orders/:id/status
 * @desc    Update order status
 * @access  Private (Admin)
 */
router.patch('/orders/:id/status', [
  body('status')
    .isIn(['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'])
    .withMessage("Status must be one of: 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array(), message: 'Validation failed' });
  }

  try {
    const { status } = req.body;
    let order = null;

    if (isMongo()) {
      order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );
    } else {
      order = await demoStore.updateOrderById(req.params.id, { status });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid order ID format.' });
    }
    console.error('PATCH /admin/orders/:id/status error:', err);
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard metrics & recent orders
 * @access  Private (Admin)
 */
router.get('/stats', async (req, res) => {
  try {
    let totalOrders = 0;
    let pendingOrders = 0;
    let totalProducts = 0;
    let totalContacts = 0;
    let recentOrders = [];

    if (isMongo()) {
      [totalOrders, pendingOrders, totalProducts, totalContacts, recentOrders] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: 'Pending' }),
        Product.countDocuments(),
        ContactMessage.countDocuments(),
        Order.find().sort({ createdAt: -1 }).limit(5)
      ]);
    } else {
      totalOrders = await demoStore.countOrders();
      pendingOrders = await demoStore.countOrders({ status: 'Pending' });
      totalProducts = await demoStore.countProducts();
      totalContacts = await demoStore.countContacts();
      recentOrders = await demoStore.findOrders().sort({ createdAt: -1 }).limit(5);
    }

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        totalProducts,
        totalContacts,
        recentOrders
      }
    });
  } catch (err) {
    console.error('GET /admin/stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics.' });
  }
});

/**
 * @route   GET /api/admin/products
 * @desc    Get all products sorted by category and name
 * @access  Private (Admin)
 */
router.get('/products', async (req, res) => {
  try {
    let products = [];
    if (isMongo()) {
      products = await Product.find().sort({ category: 1, name: 1 });
    } else {
      products = await demoStore.findProducts().sort({ category: 1, name: 1 });
    }
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    console.error('GET /admin/products error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

/**
 * @route   POST /api/admin/products
 * @desc    Create a new product
 * @access  Private (Admin)
 */
router.post('/products', [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid non-negative price is required'),
  body('category').isIn(['Cakes', 'Cupcakes', 'Cookies', 'Pastries', 'Breads']).withMessage('Valid category is required (Cakes, Cupcakes, Cookies, Pastries, Breads)')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array(), message: 'Validation failed' });
  }

  try {
    const { name, description, price, category, imageUrl, available, featured } = req.body;
    let product = null;

    if (isMongo()) {
      product = await Product.create({
        name,
        description,
        price: Number(price),
        category,
        imageUrl: imageUrl || '',
        available: available !== undefined ? Boolean(available) : true,
        featured: featured !== undefined ? Boolean(featured) : false
      });
    } else {
      product = await demoStore.createProduct({
        name,
        description,
        price: Number(price),
        category,
        imageUrl: imageUrl || '',
        available,
        featured
      });
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (err) {
    console.error('POST /admin/products error:', err);
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update an existing product
 * @access  Private (Admin)
 */
router.put('/products/:id', async (req, res) => {
  try {
    let product = null;

    if (isMongo()) {
      product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      product = await demoStore.updateProductById(req.params.id, req.body);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
    }
    console.error('PUT /admin/products/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete a product
 * @access  Private (Admin)
 */
router.delete('/products/:id', async (req, res) => {
  try {
    let product = null;

    if (isMongo()) {
      product = await Product.findByIdAndDelete(req.params.id);
    } else {
      product = await demoStore.deleteProductById(req.params.id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
    }
    console.error('DELETE /admin/products/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

/**
 * @route   GET /api/admin/contacts
 * @desc    List all contact messages and mark unread as read
 * @access  Private (Admin)
 */
router.get('/contacts', async (req, res) => {
  try {
    let contacts = [];
    if (isMongo()) {
      contacts = await ContactMessage.find().sort({ createdAt: -1 });
      await ContactMessage.updateMany({ read: false }, { $set: { read: true } });
    } else {
      contacts = await demoStore.findContacts().sort({ createdAt: -1 });
      await demoStore.markContactsAsRead();
    }

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    console.error('GET /admin/contacts error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch contact messages.' });
  }
});

module.exports = router;
