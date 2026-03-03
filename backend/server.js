const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

/* ======================================================
   BOOKING ROUTES (USING ONLY 'bookings' TABLE)
====================================================== */

// 1. PLACE BOOKING (User Side)
app.post('/api/book-service', async (req, res) => {
    const { userId, customer_name, services, total_price, phone, branch, service_date, problem } = req.body;

    try {
        const sql = `
            INSERT INTO bookings 
            (user_id, customer_name, services, total_price, phone, branch, service_date, problem_description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
        `;

        await db.query(sql, [
            userId,
            customer_name,
            JSON.stringify(services),
            total_price,
            phone,
            branch,
            service_date,
            problem
        ]);

        res.status(201).json({ message: "Booking successful!" });

    } catch (err) {
        console.error("Booking Error:", err);
        res.status(500).json({ error: "Failed to place booking" });
    }
});


// 2. FETCH USER BOOKINGS (User History Page)
app.get('/api/user-orders/:userId', async (req, res) => {
    try {
        const [results] = await db.query(
            "SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC",
            [req.params.userId]
        );

        res.status(200).json(results);

    } catch (err) {
        console.error("User Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch your history" });
    }
});


// 3. USER CANCEL BOOKING
app.patch('/api/cancel-order/:id', async (req, res) => {
    try {
        await db.query(
            "UPDATE bookings SET status = 'Cancelled' WHERE id = ?",
            [req.params.id]
        );

        res.status(200).json({ message: "Booking cancelled" });

    } catch (err) {
        console.error("Cancel Error:", err);
        res.status(500).json({ error: "Failed to cancel booking" });
    }
});


/* ======================================================
   ADMIN ROUTES
====================================================== */

// 4. FETCH ALL BOOKINGS (Admin Dashboard)
app.get('/api/admin-orders', async (req, res) => {
    try {
        const sql = `
            SELECT bookings.*, users.name AS user_name, users.email
            FROM bookings
            JOIN users ON bookings.user_id = users.id
            ORDER BY created_at DESC
        `;

        const [results] = await db.query(sql);

        res.status(200).json(results);

    } catch (err) {
        console.error("Admin Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});


// 5. UPDATE STATUS (Admin Accept / Complete)
app.patch('/api/update-status/:id', async (req, res) => {
    const { status } = req.body;

    try {
        await db.query(
            "UPDATE bookings SET status = ? WHERE id = ?",
            [status, req.params.id]
        );

        res.status(200).json({ message: `Booking marked as ${status}` });

    } catch (err) {
        console.error("Status Update Error:", err);
        res.status(500).json({ error: "Failed to update status" });
    }
});


// 6. ADMIN CANCEL WITH NOTE
app.patch('/api/admin-cancel/:id', async (req, res) => {
    const { reason } = req.body;

    try {
        await db.query(
            "UPDATE bookings SET status = 'Cancelled', notes = ? WHERE id = ?",
            [reason, req.params.id]
        );

        res.status(200).json({ message: "Booking cancelled with note" });

    } catch (err) {
        console.error("Admin Cancel Error:", err);
        res.status(500).json({ error: "Failed to cancel booking" });
    }
});


/* ======================================================
   AUTH ROUTES
====================================================== */

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const [existingUser] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0)
            return res.status(400).json({ message: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully!" });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0)
            return res.status(400).json({ message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, users[0].password);

        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: users[0].id,
                name: users[0].name,
                email: users[0].email,
                role: users[0].role
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


/* ====================================================== */

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));