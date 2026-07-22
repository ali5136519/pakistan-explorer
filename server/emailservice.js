const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendBookingConfirmation(booking) {
    try {
        await transporter.sendMail({
            from: `"Pakistan Explorer" <${process.env.EMAIL_USER}>`,
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

                <p>Our team will contact you shortly to confirm your booking.</p>

                <br>

                <b>Pakistan Explorer Team</b>
            `,
        });

        console.log("Booking confirmation email sent.");
    } catch (err) {
        console.log("User Email Error:", err);
    }
}

async function sendAdminBookingNotification(booking) {
    try {
        await transporter.sendMail({
            from: `"Pakistan Explorer" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "New Booking Received",
            html: `
                <h2>New Booking Received</h2>

                <ul>
                    <li><b>Name:</b> ${booking.name}</li>
                    <li><b>Email:</b> ${booking.email}</li>
                    <li><b>Phone:</b> ${booking.phone}</li>
                    <li><b>City:</b> ${booking.city}</li>
                    <li><b>Package:</b> ${booking.packageName}</li>
                    <li><b>Travel Date:</b> ${booking.travelDate}</li>
                    <li><b>Travelers:</b> ${booking.travelers}</li>
                    <li><b>Total Amount:</b> PKR ${booking.totalAmount}</li>
                </ul>
            `,
        });

        console.log("Admin notification email sent.");
    } catch (err) {
        console.log("Admin Email Error:", err);
    }
}

module.exports = {
    sendBookingConfirmation,
    sendAdminBookingNotification,
};