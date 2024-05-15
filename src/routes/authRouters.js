const express = require('express');
const router = express.Router();
const path = require('path');
const hasAuthority = require('../config/hasAuthority');
const pool = require('../config/pool');

// Publicly accessible login route
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/auth/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/auth/register.html'));
});

router.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  try {
    // Check if the token exists and is valid
    const [rows] = await pool.promise().query('SELECT * FROM _User_reset_tokens WHERE token = ?', [token]);
    const resetToken = rows[0];

    if (!resetToken) {
      // Token not found or expired
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    const currentDate = new Date();
    if (currentDate > resetToken.expiry_date) {
      // Token expired
      return res.status(404).json({ error: 'Token expired' });
    }

    // Send the reset password HTML file
    res.sendFile(path.join(__dirname, '../views/auth/newpassword.html'));

  } catch (error) {
    console.error('Error validating reset token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/reset-email', (req,res) =>{
  res.sendFile(path.join(__dirname, '../views/auth/resetpassword.html'));
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.clearCookie('connect.sid'); // Remove the session cookie
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Your other routes can remain unchanged

module.exports = router;
