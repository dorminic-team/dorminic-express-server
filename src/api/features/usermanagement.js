const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const pool = require('../../config/pool');

router.post('/users', async (req, res) => {
    const { org_code } = req.body;

    try {
        // Check if org_code is provided in the request body
        if (!org_code) {
            return res.status(400).json({ error: 'Organization code is required' });
        }

        // SQL query to retrieve users by org_code
        const getUsersQuery = 'SELECT * FROM _User WHERE org_code = ?';
        const [users] = await pool.promise().query(getUsersQuery, [org_code]);

        return res.status(200).json({ users });
    } catch (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

module.exports = { router };