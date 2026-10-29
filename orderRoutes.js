const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
const Order = require('../models/Order');
const Product = require('../models/Product');
const demoStore = require('../utils/demoStore');

const isMongo = () => mongoose.connection.readyState === 1;

/**
 * @route   POST /api/orders
 * @desc    Create a regular cart order
 * @access  Public
 */
router.post('/', [
  body('customer.name').trim().notEmpty().withMessage('Customer name is required'),
  body('customer.phone').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian phone number required'),
  body('customer.email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('customer.address').trim().notEmpty().withMessage('Customer address is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array(), message: errors.array()[0].msg });
  }

  try {
    const { customer, items, deliveryDate, deliveryTime, instructions, paymentMethod } = req.body;

    const verifiedItems = [];
    let subtotal = 0;

    for (const item of items) {
      let product = null;
      if (isMongo()) {
        product = await Product.findById(item.productId);
      } else {
        product = await demoStore.findProductById(item.productId);
      }

      if (!product || !product.available) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name || item.productId} is not available.`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      verifiedItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }

    const deliveryCharge = subtotal < 500 ? 50 : 0;
    const total = subtotal + deliveryCharge;
    const orderId = 'BKR' + nanoid(8).toUpperCase();

    const orderData = {
      orderId,
      type: 'regular',
      items: verifiedItems,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address
      },
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      deliveryTime: deliveryTime || '',
      instructions: instructions || '',
      status: 'Pending',
      total,
      paymentMethod: paymentMethod || 'Cash on Delivery'
    };

    let createdOrder = null;
    if (isMongo()) {
      const order = new Order(orderData);
      await order.save();
      createdOrder = order;
    } else {
      createdOrder = demoStore.createOrder(orderData);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: createdOrder.orderId,
        total: createdOrder.total,
        status: createdOrder.status
      },
      order: {
        orderId: createdOrder.orderId,
        total: createdOrder.total,
        status: createdOrder.status
      }
    });
  } catch (err) {
    console.error('POST /orders error:', err);
    res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
});

/**
 * @route   POST /api/orders/custom
 * @desc    Create a custom cake order
 * @access  Public
 */
router.post('/custom', (req, res, next) => {
  // Normalize cakeDetails into customDetails so frontend can send either
  if (req.body.cakeDetails && !req.body.customDetails) {
    req.body.customDetails = req.body.cakeDetails;
  }
  next();
}, [
  body('customer.name').trim().notEmpty().withMessage('Customer name is required'),
  body('customer.phone').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian phone number required'),
  body('customer.email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('customer.address').trim().notEmpty().withMessage('Customer address is required'),
  body('customDetails.size').isIn(['6-inch', '8-inch', '10-inch', '12-inch']).withMessage('Valid size is required (6-inch, 8-inch, 10-inch, 12-inch)'),
  body('customDetails.flavor').trim().notEmpty().withMessage('Flavor is required'),
  body('customDetails.cakeType').trim().notEmpty().withMessage('Cake type is required'),
  body('deliveryDate').notEmpty().withMessage('Valid delivery date is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array(), message: errors.array()[0].msg });
  }

  try {
    const { customer, customDetails, deliveryDate, deliveryTime, instructions, paymentMethod } = req.body;

    const basePrices = {
      '6-inch': 500,
      '8-inch': 800,
      '10-inch': 1200,
      '12-inch': 1800
    };

    let unitPrice = basePrices[customDetails.size] || 500;

    const premiumFlavors = ['Red Velvet', 'Black Forest', 'Hazelnut'];
    if (customDetails.flavor && premiumFlavors.some(f => f.toLowerCase() === customDetails.flavor.toLowerCase())) {
      unitPrice += 100;
    }

    const premiumFrostings = ['Fondant', 'Cream Cheese'];
    if (customDetails.frosting && premiumFrostings.some(f => f.toLowerCase() === customDetails.frosting.toLowerCase())) {
      unitPrice += 100;
    }

    if (customDetails.message && customDetails.message.trim().length > 0) {
      unitPrice += 50;
    }

    const quantity = Math.max(1, parseInt(customDetails.quantity, 10) || 1);
    const total = unitPrice * quantity;

    const orderId = 'BKR' + nanoid(8).toUpperCase();

    const orderData = {
      orderId,
      type: 'custom',
      customDetails: {
        cakeType: customDetails.cakeType,
        size: customDetails.size,
        flavor: customDetails.flavor,
        frosting: customDetails.frosting || '',
        theme: customDetails.theme || '',
        message: customDetails.message || '',
        quantity
      },
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address
      },
      deliveryDate: new Date(deliveryDate),
      deliveryTime: deliveryTime || '',
      instructions: instructions || '',
      status: 'Pending',
      total,
      paymentMethod: paymentMethod || 'Cash on Delivery'
    };

    let createdOrder = null;
    if (isMongo()) {
      const order = new Order(orderData);
      await order.save();
      createdOrder = order;
    } else {
      createdOrder = demoStore.createOrder(orderData);
    }

    res.status(201).json({
      success: true,
      message: 'Custom order placed successfully',
      data: {
        orderId: createdOrder.orderId,
        total: createdOrder.total,
        status: createdOrder.status
      },
      order: {
        orderId: createdOrder.orderId,
        total: createdOrder.total,
        status: createdOrder.status
      }
    });
  } catch (err) {
    console.error('POST /orders/custom error:', err);
    res.status(500).json({ success: false, message: 'Failed to place custom order.' });
  }
});

/**
 * @route   GET /api/orders/track
 * @desc    Track an order by orderId and phone number
 * @access  Public
 */
router.get('/track', async (req, res) => {
  try {
    const { orderId, phone } = req.query;

    if (!orderId || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Both orderId and phone number are required for tracking.'
      });
    }

    let order = null;
    if (isMongo()) {
      order = await Order.findOne({
        orderId: orderId.trim().toUpperCase(),
        'customer.phone': phone.trim()
      });
    } else {
      order = await demoStore.findOrderByQuery({
        orderId: orderId.trim().toUpperCase(),
        'customer.phone': phone.trim()
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No order found matching the provided Order ID and phone number. Please check the details and try again.'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order.orderId,
        type: order.type,
        status: order.status,
        total: order.total,
        paymentMethod: order.paymentMethod,
        customer: {
          name: order.customer.name
        },
        items: order.items,
        customDetails: order.customDetails,
        deliveryDate: order.deliveryDate,
        deliveryTime: order.deliveryTime,
        createdAt: order.createdAt
      }
    });
  } catch (err) {
    console.error('GET /orders/track error:', err);
    res.status(500).json({ success: false, message: 'Failed to track order.' });
  }
});

module.exports = router;
