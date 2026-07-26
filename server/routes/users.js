const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Booking = require('../models/booking');

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Get all users (Admin only)
router.get('/all', verifyToken, async (req, res) => {
  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    const users = await User.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      users.map(async (user) => {

        const bookingCount = await Booking.countDocuments({
          user: user._id
        });

        return {
          _id: user._id,
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          city: user.city,
          joined: new Date(user.createdAt).toLocaleDateString(),
          bookings: bookingCount,
          status:
            user.status === 'blocked'
              ? 'Blocked'
              : 'Active'
        };
      })
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});


// Block / Unblock user
router.put('/:id/status', verifyToken, async (req, res) => {

  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access only'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status
      },
      {
        new: true
      }
    );

    res.json({
      message: 'Status updated',
      user
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });

  }

});

module.exports = router;