const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const jwt = require('jsonwebtoken');

const {
  sendBookingConfirmation,
  sendAdminBookingNotification
} = require('../emailservice');

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
}

router.post('/', verifyToken, async (req, res) => {

  console.log("STEP 1: Booking request received");

  try {

    const {
      fullName,
      email,
      phone,
      city,
      packageName,
      packagePrice,
      travelDate,
      travelers,
      totalAmount,
      specialRequests
    } = req.body;

    const booking = new Booking({
      user: req.user.userId,
      fullName,
      email,
      phone,
      city,
      packageName,
      packagePrice,
      travelDate,
      travelers,
      totalAmount,
      specialRequests: specialRequests || ''
    });

    console.log("STEP 2: Before booking.save()");

    await booking.save();

    console.log("STEP 3: Booking saved");

    // Send response immediately
    console.log("STEP 4: Sending response");

    res.status(201).json({
      message: "Booking submitted successfully",
      booking
    });

    // Send admin email in background
    sendAdminBookingNotification({
      name: fullName,
      email: email,
      phone: phone,
      city: city,
      packageName: packageName,
      travelDate: travelDate,
      travelers: travelers,
      totalAmount: totalAmount
    })
      .then(() => {
        console.log("Admin email sent");
      })
      .catch(err => {
        console.log("Admin Email Error:", err);
      });

    // Send user confirmation email in background
    sendBookingConfirmation({
      name: fullName,
      email: email,
      packageName: packageName,
      travelDate: travelDate,
      travelers: travelers
    })
      .then(() => {
        console.log("User email sent");
      })
      .catch(err => {
        console.log("User Email Error:", err);
      });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

});

router.get('/my', verifyToken, async (req, res) => {

  try {

    const bookings = await Booking.find({
      user: req.user.userId
    }).sort({
      createdAt: -1
    });

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

});

router.get('/all', verifyToken, async (req, res) => {

  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access only'
      });
    }

    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .sort({
        createdAt: -1
      });

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

});

router.put('/:id/status', verifyToken, async (req, res) => {

  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access only'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status
      },
      {
        new: true
      }
    );

    res.json({
      message: "Status updated",
      booking
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

});

module.exports = router;
