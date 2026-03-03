const express = require('express');
const router = express.Router();
const db = require('../db'); 

// 1. CREATE ORDER (User Action)
router.post('/orders', async (req, res) => {
    const { userId, name, items, total, details } = req.body;
    const servicesString = JSON.stringify(items);

    try {
        const sql = "INSERT INTO bookings (user_id, customer_name, services, total_price, phone, branch, service_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [userId, name, servicesString, total, details.phone, details.branch, details.date, details.notes];

        await db.query(sql, values);
        res.status(200).json({ message: "Success" });
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. GET USER ORDERS (User Action - History)
router.get('/user-orders/:userId', async (req, res) => {
    try {
        const [results] = await db.query(
            "SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC", 
            [req.params.userId]
        );
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. CANCEL ORDER (User Action - Soft Update)
router.patch('/cancel-order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const sql = "UPDATE bookings SET status = 'Cancelled' WHERE id = ?";
        await db.query(sql, [orderId]);
        res.status(200).json({ message: "Status updated to Cancelled" });
    } catch (err) {
        console.error("Cancel Error:", err);
        res.status(500).json({ error: "Failed to update database" });
    }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

// 4. GET ALL ORDERS (Admin Action - Global Dashboard)
router.get('/admin-orders', async (req, res) => {
    try {
        // Fetches user identity via JOIN while keeping all booking columns
        const sql = `
            SELECT bookings.*, users.name AS user_table_name, users.email 
            FROM bookings 
            JOIN users ON bookings.user_id = users.id 
            ORDER BY created_at DESC
        `;
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error("Admin Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 5. UPDATE STATUS (Admin Action - Accept & Finish Workflow)
router.patch('/update-status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; 
        
        const sql = "UPDATE bookings SET status = ? WHERE id = ?";
        await db.query(sql, [status, orderId]);
        
        res.status(200).json({ message: `Order marked as ${status}` });
    } catch (err) {
        console.error("Status Update Error:", err);
        res.status(500).json({ error: "Failed to update status" });
    }
});

// 6. ADMIN CANCEL (With Reschedule/Busy Day Note)
router.patch('/admin-cancel/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body; 
        
        // Updates status and provides the reason via the 'notes' column
        const sql = "UPDATE bookings SET status = 'Cancelled', notes = ? WHERE id = ?";
        await db.query(sql, [reason, orderId]);
        
        res.status(200).json({ message: "Order cancelled with note" });
    } catch (err) {
        console.error("Admin Cancel Error:", err);
        res.status(500).json({ error: "Failed to cancel order" });
    }
});

module.exports = router;