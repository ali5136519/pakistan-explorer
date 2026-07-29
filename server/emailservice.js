const axios = require("axios");

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbz0t1t-xtA4olS9ae25UcoM2KrjV7UbmY2KwmIPXKVwIyrg1906tmTWJMaPDklQLok4dg/exec";

// ============================
// USER BOOKING EMAIL
// ============================
async function sendBookingConfirmation(booking) {

  try {
const response = await axios.post(
  SCRIPT_URL,
  {
      to: booking.email,
      subject: "Booking Confirmation - Pakistan Explorer",
      html: `
        <h2>Thank you for booking with Pakistan Explorer!</h2>

        <p>Dear <b>${booking.name}</b>,</p>

        <p>Your booking has been received successfully.</p>

        <h3>Booking Details</h3>

        <ul>
          <li><b>Package:</b> ${booking.packageName}</li>
          <li><b>Travel Date:</b> ${booking.travelDate}</li>
          <li><b>Travelers:</b> ${booking.travelers}</li>
        </ul>

        <p>Our team will contact you shortly.</p>

        <br>

        <b>Pakistan Explorer Team</b>
      `
      },
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
);
console.log("User Apps Script Response:", response.data);

    console.log("✅ User email sent");

  } catch (err) {

    console.log("❌ User Email Error:", err.response?.data || err.message);

  }

}

// ============================
// ADMIN BOOKING EMAIL
// ============================
async function sendAdminBookingNotification(booking) {

  try {

    const response = await axios.post(
  SCRIPT_URL,
  {
      to: "ali5136519@gmail.com",
      subject: "New Booking Received",
      html: `
        <h2>New Booking Received</h2>

        <ul>
          <li><b>Name:</b> ${booking.name}</li>
          <li><b>Email:</b> ${booking.email}</li>
          <li><b>Phone:</b> ${booking.phone}</li>
          <li><b>City:</b> ${booking.city}</li>
          <li><b>Package:</b> ${booking.packageName}</li>
          <li><b>Date:</b> ${booking.travelDate}</li>
          <li><b>Travelers:</b> ${booking.travelers}</li>
          <li><b>Total:</b> PKR ${booking.totalAmount}</li>
        </ul>
      `
      },
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
);
console.log("Admin Apps Script Response:", response.data);

    console.log("✅ Admin email sent");

  } catch (err) {

    console.log("❌ Admin Email Error:", err.response?.data || err.message);

  }

}

module.exports = {
  sendBookingConfirmation,
  sendAdminBookingNotification
};