const express = require('express');
const router = express.Router();
const db = require('../db'); 

// 1. PLACE BOOKING
router.post('/book-service', async (req, res) => {
    const { userId, customer_name, services, total_price, phone, branch, preferred_dates, problem } = req.body;
    
    try {
        const sql = `INSERT INTO bookings 
            (user_id, customer_name, services, total_price, phone, branch, preferred_dates, problem_description, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;
        
        await db.query(sql, [userId, customer_name, JSON.stringify(services), total_price, phone, branch, preferred_dates, problem]);
        res.status(201).json({ message: "Booking Request Sent" });
    } catch (err) {
        console.error("Booking Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. GET USER ORDERS
router.get('/user-orders/:userId', async (req, res) => {
    try {
        // Explicitly selecting all columns to ensure nothing is missed
        const [results] = await db.query("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC", [req.params.userId]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. USER: CANCEL ORDER
router.patch('/cancel-order/:orderId', async (req, res) => {
    try {
        await db.query("UPDATE bookings SET status = 'Cancelled', notes = 'Cancelled by User' WHERE id = ?", [req.params.orderId]);
        res.status(200).json({ message: "Order Cancelled" });
    } catch (err) {
        res.status(500).json({ error: "Cancel failed" });
    }
});

// 4. ADMIN: GET ALL ORDERS
router.get('/admin-orders', async (req, res) => {
    try {
        const sql = `SELECT bookings.*, users.name AS user_table_name, users.email 
                     FROM bookings JOIN users ON bookings.user_id = users.id 
                     ORDER BY created_at DESC`;
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. ADMIN: UPDATE STATUS & CONFIRM DATE
router.patch('/update-status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, confirmed_date } = req.body; 
        
        if (status === 'Accepted' && confirmed_date) {
            await db.query("UPDATE bookings SET status = ?, service_date = ? WHERE id = ?", [status, confirmed_date, orderId]);
        } else {
            await db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, orderId]);
        }
        res.status(200).json({ message: `Order updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

// 6. ADMIN: CANCEL WITH REASON
router.patch('/admin-cancel/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body; // Capture the reason from the frontend prompt
        await db.query("UPDATE bookings SET status = 'Cancelled', notes = ? WHERE id = ?", [reason, orderId]);
        res.status(200).json({ message: "Order cancelled with reason recorded" });
    } catch (err) {
        res.status(500).json({ error: "Admin cancel failed" });
    }
});

module.exports = router;