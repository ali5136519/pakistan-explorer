const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/', async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            subject,
            message
        } = req.body;

        // Admin Email
        await transporter.sendMail({

            from: `"Pakistan Explorer" <${process.env.EMAIL_USER}>`,

            to: process.env.EMAIL_USER,

            subject: `Contact Form - ${subject}`,

            html: `
                <h2>New Contact Message</h2>

                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Subject:</b> ${subject}</p>

                <p><b>Message:</b></p>

                <p>${message}</p>
            `
        });

        // User Auto Reply
        await transporter.sendMail({

            from: `"Pakistan Explorer" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "Thank You for Contacting Pakistan Explorer",

            html: `
                <h2>Thank You!</h2>

                <p>Dear <b>${name}</b>,</p>

                <p>We have received your message successfully.</p>

                <p>Our team will contact you as soon as possible.</p>

                <br>

                <b>Pakistan Explorer Team</b>
            `
        });

        res.json({
            message: "Message sent successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Email sending failed"
        });

    }

});

module.exports = router;