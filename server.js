const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false
}));

// Serve frontend files (login.html, signup.html, style.css)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', authRoutes);

// Simple dashboard route to prove login worked
app.get('/dashboard.html', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login.html');
    }
    res.send('<h1>Welcome! You are logged in.</h1><a href="/api/logout">Logout</a>');
});

app.get('/api/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
