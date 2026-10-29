const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const AdminUser = require('../models/AdminUser');
const demoStore = require('../utils/demoStore');

const isMongo = () => mongoose.connection.readyState === 1;

router.post('/login', [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    let admin = null;

    if (isMongo()) {
      admin = await AdminUser.findOne({ email });
    } else {
      admin = await demoStore.findAdminByEmail(email);
    }

    if (!admin) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (err) {
    console.error('POST /auth/login error:', err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

module.exports = router;
