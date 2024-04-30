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

router.post('/organization/getdetails', async (req, res) => {
    const { org_code } = req.body;

    // Check if org_code is provided in the request body
    if (!org_code) {
        return res.status(400).json({ error: 'org_code is required' });
    }

    try {
        // Acquire a connection from the pool
        const connection = await pool.getConnection();

        // Query to fetch organization details based on org_code
        const query = 'SELECT name, description FROM _organization WHERE org_code = ?';

        // Execute the query asynchronously
        const results = await connection.query(query, [org_code]);

        // Release the connection back to the pool
        connection.release();

        // Check if organization exists
        if (results.length === 0) {
            return res.status(404).json({ error: 'Organization not found' });
        }
        
        // Send the organization details as a JSON response
        res.status(200).json({ organization: results[0] });
    } catch (err) {
        console.error('Error fetching organization details:', err);
        return res.status(500).json({ error: 'Error fetching organization details' });
    }
});

router.post('/room/getdetails', async (req, res) => {
    const { org_code, tenant_id } = req.body;
    if (!org_code || !tenant_id) {
        return res.status(400).json({ error: 'org_code and tenant_id are required' });
    }

    try {
        const connection = await pool.getConnection();
        const tableName = `organization_${org_code}`;
        const query = `SELECT room_number FROM ${tableName} WHERE tenant_id = ?`;
        const results = await connection.query(query, [tenant_id]);
        connection.release();

        if (results.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        
        // Send room details as a JSON response
        res.status(200).json({ room_number: results[0] });
    } catch (error) {
        console.error('Error fetching room details:', error);
        return res.status(500).json({ error: 'Error fetching room details' });
    }
});


module.exports = router;