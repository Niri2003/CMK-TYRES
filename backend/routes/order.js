const express = require('express');
const router = express.Router();
const db = require('../db'); 
const { sendUserEmail } = require('../utils/emailService');

// 1. PLACE BOOKING
router.post('/book-service', async (req, res) => {
    const { userId, customer_name, services, total_price, phone, branch, preferred_dates, problem } = req.body;
    try {
        const sql = `INSERT INTO bookings 
            (user_id, customer_name, services, total_price, phone, branch, preferred_dates, problem_description, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;
        
        // Ensure services and dates are stringified for MySQL JSON compatibility
        const servicesStr = JSON.stringify(services);
        const datesStr = typeof preferred_dates === 'string' ? preferred_dates : JSON.stringify(preferred_dates);

        await db.query(sql, [userId, customer_name, servicesStr, total_price, phone, branch, datesStr, problem]);
        res.status(201).json({ message: "Booking Request Sent" });
    } catch (err) {
        console.error("Booking Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. GET USER ORDERS (History)
router.get('/user-orders/:userId', async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC", [req.params.userId]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET ALL ORDERS (Admin View)
router.get('/admin-orders', async (req, res) => {
    try {
        // We use LEFT JOIN to get the email from the users table
        const sql = `SELECT b.*, u.email 
                     FROM bookings b 
                     LEFT JOIN users u ON b.user_id = u.id 
                     ORDER BY b.created_at DESC`;
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. UPDATE STATUS (Accept / Finish) + EMAIL LOGIC
router.patch('/update-status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, confirmed_date } = req.body; 

        // Get the current order data and the user's email
        const [rows] = await db.query(
            "SELECT b.*, u.email FROM bookings b LEFT JOIN users u ON b.user_id = u.id WHERE b.id = ?", 
            [orderId]
        );
        const order = rows[0];

        if (!order) return res.status(404).json({ error: "Order not found" });

        // Update Database
        if (status === 'Accepted' && confirmed_date) {
            await db.query("UPDATE bookings SET status = ?, service_date = ? WHERE id = ?", [status, confirmed_date, orderId]);
        } else {
            await db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, orderId]);
        }

        // --- EMAIL LOGIC ---
        if (order.email) {
            if (status === 'Accepted' && confirmed_date) {
                await sendUserEmail(order.email, "Booking Confirmed! ✅", `
                    <h3>Hi ${order.customer_name},</h3>
                    <p>Your booking has been accepted for: <b>${confirmed_date}</b></p>
                    <p>Branch: ${order.branch}</p>
                `);
            } 
            else if (status === 'Completed') {
                // Parse the services JSON into a bulleted list
                let servicesListHtml = "<ul>";
                try {
                    const servicesArray = typeof order.services === 'string' ? JSON.parse(order.services) : order.services;
                    if (Array.isArray(servicesArray)) {
                        servicesListHtml += servicesArray.map(s => `<li>${s.title || s.service || s.name}</li>`).join("");
                    } else {
                        servicesListHtml += "<li>General Service</li>";
                    }
                } catch (e) {
                    servicesListHtml += "<li>Maintenance Service</li>";
                }
                servicesListHtml += "</ul>";

                await sendUserEmail(order.email, "Service Completed - Invoice 📄", `
                    <h3>Your Service is Complete!</h3>
                    <p>Hi ${order.customer_name}, your vehicle is ready for pickup.</p>
                    <p><b>Services Performed:</b></p>
                    ${servicesListHtml}
                    <p><b>Total Amount: ₹${order.total_price}</b></p>
                    <p>Thank you for choosing CMK Auto Services!</p>
                `);
            }
        }

        res.status(200).json({ message: "Status updated and email sent." });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Update failed" });
    }
});

// 5. ADMIN: CANCEL WITH REASON
router.patch('/admin-cancel/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;

        const [rows] = await db.query(
            "SELECT b.customer_name, u.email FROM bookings b LEFT JOIN users u ON b.user_id = u.id WHERE b.id = ?", 
            [orderId]
        );
        const order = rows[0];

        await db.query("UPDATE bookings SET status = 'Cancelled', notes = ? WHERE id = ?", [reason, orderId]);

        if (order && order.email) {
            await sendUserEmail(order.email, "Booking Cancelled ⚠️", `
                <p>Hi ${order.customer_name},</p>
                <p>Your booking was cancelled for the following reason:</p>
                <p style="color: red;"><b>${reason}</b></p>
            `);
        }

        res.status(200).json({ message: "Order cancelled and user notified." });
    } catch (err) {
        res.status(500).json({ error: "Cancellation failed" });
    }
});

module.exports = router;