const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const { adminAuth } = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt for email:', email);

    // Find admin user
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password using the model's method
    const isMatch = await admin.comparePassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for admin:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Admin login successful for:', email);

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings (admin only)
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    console.log('Fetching all bookings');
    const bookings = await Booking.find()
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'event',
        select: 'name type description images',
        options: { lean: true }
      })
      .populate({
        path: 'package',
        select: 'name price duration'
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${bookings.length} bookings`);

    bookings.slice(0, 3).forEach((booking, index) => {
      console.log(`Booking ${index + 1}:`, {
        id: booking._id,
        eventId: booking.event?._id || booking.event,
        hasUser: !!booking.user,
        hasEvent: !!booking.event,
        hasPackage: !!booking.package,
        user: booking.user ? { id: booking.user._id, name: booking.user.name } : null,
        event: booking.event ? { id: booking.event._id, name: booking.event.name } : null,
        package: booking.package ? { id: booking.package._id, name: booking.package.name } : null
      });
    });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (admin only)
router.patch('/bookings/:id', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = req.body.status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete all bookings (admin only)
router.delete('/bookings/all', adminAuth, async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.json({ message: 'All bookings deleted successfully' });
  } catch (error) {
    console.error('Delete all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete all messages (admin only)
router.delete('/messages/all', adminAuth, async (req, res) => {
  try {
    await Message.deleteMany({});
    res.json({ message: 'All messages deleted successfully' });
  } catch (error) {
    console.error('Delete all messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 