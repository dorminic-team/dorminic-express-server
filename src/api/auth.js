const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/pool');


const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstname, lastname, username, password } = req.body;
  
    // Generate a UUID for the user ID
    let userId = uuidv4();

    let isUnique = false;
    while (!isUnique) {
      const [existingUsers] = await pool.query('SELECT id FROM _User WHERE id = ?', [userId]);
      if (existingUsers.length === 0) {
        isUnique = true;
      } else {
        userId = uuidv4();
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'user';
  
    pool.query(
      'INSERT INTO _User (id, firstname, lastname, username, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, firstname, lastname, username, hashedPassword, role],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error registering user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });

module.exports = router;