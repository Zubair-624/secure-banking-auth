const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const SALT_ROUNDS = 10;

// Basic email format check
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------- SIGNUP ----------------
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Validation (this logic is exactly what your White Box test cases will describe)
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    try {
        // Check for duplicate email
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        // Hash password before storing (never store plain text)
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );

        return res.json({ success: true, message: 'Account created successfully!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
        }

        req.session.userId = user.id;
        return res.json({ success: true, message: 'Login successful!', redirect: '/dashboard.html' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

module.exports = router;
