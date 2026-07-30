const axios = require("axios");

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyxsXANLPg8krSSVpGd4SrS36u3YtqGJHkVnIqfZmEoyZR_RnTjnIJVpku2bBThcj4qPQ/exec";

// =======================================================
// BOOKING - USER EMAIL
// =======================================================
async function sendBookingConfirmation(booking) {

  try {

    const response = await axios.post(SCRIPT_URL, {
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
    });

    console.log("User Apps Script Response:", response.data);
    console.log("✅ User booking email sent");

  } catch (err) {

    console.log("❌ User Booking Email Error:", err.response?.data || err.message);

  }

}

// =======================================================
// BOOKING - ADMIN EMAIL
// =======================================================
async function sendAdminBookingNotification(booking) {

  try {

    const response = await axios.post(SCRIPT_URL, {
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
    });

    console.log("Admin Apps Script Response:", response.data);
    console.log("✅ Admin booking email sent");

  } catch (err) {

    console.log("❌ Admin Booking Email Error:", err.response?.data || err.message);

  }

}

// =======================================================
// CONTACT - USER AUTO REPLY
// =======================================================
async function sendContactAutoReply(contact) {

  try {

    const response = await axios.post(SCRIPT_URL, {
      to: contact.email,
      subject: "Thank You for Contacting Pakistan Explorer",
      html: `
        <h2>Thank You!</h2>

        <p>Dear <b>${contact.name}</b>,</p>

        <p>We have received your message successfully.</p>

        <p>Our team will contact you as soon as possible.</p>

        <br>

        <b>Pakistan Explorer Team</b>
      `
    });

    console.log("User Contact Response:", response.data);
    console.log("✅ User contact email sent");

  } catch (err) {

    console.log("❌ User Contact Email Error:", err.response?.data || err.message);

  }

}

// =======================================================
// CONTACT - ADMIN EMAIL
// =======================================================
async function sendAdminContactNotification(contact) {

  try {

    const response = await axios.post(SCRIPT_URL, {
      to: "ali5136519@gmail.com",
      subject: `Contact Form - ${contact.subject}`,
      html: `
        <h2>New Contact Message</h2>

        <p><b>Name:</b> ${contact.name}</p>
        <p><b>Email:</b> ${contact.email}</p>
        <p><b>Phone:</b> ${contact.phone}</p>
        <p><b>Subject:</b> ${contact.subject}</p>

        <p><b>Message:</b></p>

        <p>${contact.message}</p>
      `
    });

    console.log("Admin Contact Response:", response.data);
    console.log("✅ Admin contact email sent");

  } catch (err) {

    console.log("❌ Admin Contact Email Error:", err.response?.data || err.message);

  }

}

module.exports = {
  sendBookingConfirmation,
  sendAdminBookingNotification,
  sendContactAutoReply,
  sendAdminContactNotification
};