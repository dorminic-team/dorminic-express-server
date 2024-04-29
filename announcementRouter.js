const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: '34.87.162.93',
    user: 'root',
    password: '{TcVK9Fc]F4+8pVX',
    database: 'dorminic-data',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Create announcement
router.post('/', async (req, res) => {
    try {
        const { topic, org_code, description } = req.body;
        const connection = await pool.getConnection();
        const tableName = `annoucement_organization_${org_code}`;
        const [result] = await connection.execute(
            `INSERT INTO ${tableName} (topic, description) VALUES (?,?)`,
            [topic, description]
        );
        connection.release();
        res.status(201).json({ message: 'Announcement created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ error: 'An error occurred while creating the announcement' });
    }
});


// Read all announcements for a specific organization
router.get('/', async (req, res) => {
    try {
        const org_code = req.query.org_code; // Extract org_code from the query parameters
        if (!org_code) {
            return res.status(400).json({ error: 'Organization code is required in the query parameters' });
        }

        const connection = await pool.getConnection();
        const tableName = `annoucement_organization_${org_code}`;
        const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'An error occurred while fetching announcements' });
    }
});


// Delete an announcement
router.delete('/', async (req, res) => {
    try {
        const { announcementId, org_code } = req.body;

        // Check if required parameters are provided
        if (!announcementId || !org_code) {
            return res.status(400).json({ error: 'Announcement ID and organization code are required' });
        }

        const connection = await pool.getConnection();
        const tableName = `annoucement_organization_${org_code}`;
        const [result] = await connection.execute(
            `DELETE FROM ${tableName} WHERE announcement_id = ?`,
            [announcementId]
        );
        connection.release();

        // Check if the announcement was deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ error: 'An error occurred while deleting the announcement' });
    }
});

// Set isExpired = 1 for an announcement
router.patch('/setExpired', async (req, res) => {
    try {
        const { org_code, announcementId } = req.body;

        // Check if org_code and announcementId are provided
        if (!org_code || !announcementId) {
            return res.status(400).json({ error: 'org_code and announcementId are required in the request body' });
        }

        const connection = await pool.getConnection();
        const tableName = `annoucement_organization_${org_code}`;
        const [result] = await connection.execute(
            `UPDATE ${tableName} SET isExpired = 1 WHERE announcement_id = ?`,
            [announcementId]
        );
        connection.release();

        // Check if the announcement was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.json({ message: 'Announcement isExpired updated successfully' });
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ error: 'An error occurred while updating the announcement' });
    }
});





// Other CRUD operations (GET, PUT, DELETE) can be similarly implemented

module.exports = router;
