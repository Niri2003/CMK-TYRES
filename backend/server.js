const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');
const orderRoutes = require('./routes/order'); 

const app = express();

app.use(cors());
app.use(express.json());

// Routes for bookings
app.use('/api', orderRoutes);

/* ======================================================
   RESTORED AUTH ROUTES
====================================================== */

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) return res.status(400).json({ message: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Explicitly setting default role to 'user'
        await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
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
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        
        if (users.length === 0) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, users[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Send successful response with the role included
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));