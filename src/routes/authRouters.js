const express = require('express');
const router = express.Router();
const path = require('path');
const hasAuthority = require('../config/hasAuthority');

// Publicly accessible login route
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/auth/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/auth/register.html'));
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

// Your other routes can remain unchanged

module.exports = router;
