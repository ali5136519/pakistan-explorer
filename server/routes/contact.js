const express = require('express');
const router = express.Router();

const {
  sendContactAutoReply,
  sendAdminContactNotification
} = require('../emailservice');

router.post('/', async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      subject,
      message
    } = req.body;

    // immediately response to user
    res.json({
      message: "Message sent successfully"
    });

    console.log("AFTER CONTACT RESPONSE");

    // Admin Email
    // ==========================

    console.log("Before Admin Contact Email");

    sendAdminContactNotification({
      name,
      email,
      phone,
      subject,
      message
    })
      .then(() => {
        console.log("Admin contact email sent");
      })
      .catch(err => {
        console.log("Admin Contact Email Error:", err);
      });

    
    // User Auto Reply
    // ==========================

    console.log("Before User Contact Email");

    sendContactAutoReply({
      name,
      email
    })
      .then(() => {
        console.log("User contact email sent");
      })
      .catch(err => {
        console.log("User Contact Email Error:", err);
      });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

});

module.exports = router;