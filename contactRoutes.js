const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');
const demoStore = require('../utils/demoStore');

const isMongo = () => mongoose.connection.readyState === 1;

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array(), message: errors.array()[0].msg });

  try {
    const { name, email, phone, message } = req.body;
    if (isMongo()) {
      await ContactMessage.create({ name, email, phone, message });
    } else {
      await demoStore.createContactMessage({ name, email, phone, message });
    }
    res.status(201).json({ success: true, message: "Thank you for contacting us! We'll get back to you within 24 hours." });
  } catch (err) {
    console.error('POST /contact error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;
