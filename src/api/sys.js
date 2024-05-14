const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const uuid = require('uuid');
const pool = require('../config/pool');

// FUNCTION
async function createOrganizationTables(org_code) {
    const roomTableName = `${org_code}_room`;
    const createRoomTableQuery = `CREATE TABLE ${roomTableName} (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_active ENUM('yes', 'no') DEFAULT 'yes',
        tenant_id VARCHAR(36),
        FOREIGN KEY (tenant_id) REFERENCES _User(id)
    )`;
    await pool.promise().query(createRoomTableQuery);


    const billTableName = `${org_code}_bill`;
    const createBillTableQuery = `CREATE TABLE ${billTableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cost DOUBLE,
        is_paid ENUM('yes', 'no') DEFAULT 'no',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        room_id INT,
        customer_id VARCHAR(36),
        informant_id VARCHAR(36),
        FOREIGN KEY (room_id) REFERENCES ${roomTableName}(id),
        FOREIGN KEY (informant_id) REFERENCES _User(id),
        FOREIGN KEY (customer_id) REFERENCES _User(id)
    )`;
    await pool.promise().query(createBillTableQuery);

    const announcementTableName = `${org_code}_announcement`;
    const createAnnouncementTableQuery = `CREATE TABLE ${announcementTableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            is_expired ENUM('yes', 'no') DEFAULT 'no',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            informant_id VARCHAR(36),
            FOREIGN KEY (informant_id) REFERENCES _User(id)
        )`;
    await pool.promise().query(createAnnouncementTableQuery);

    const maintenanceTableName = `${org_code}_maintenance`;
    const createMaintenanceTableQuery = `CREATE TABLE ${maintenanceTableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            is_fixed ENUM('yes', 'no') DEFAULT 'no',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            informant_id VARCHAR(36),
            room_id INT,
            FOREIGN KEY (informant_id) REFERENCES _User(id),
            FOREIGN KEY (room_id) REFERENCES ${roomTableName}(id)
        )`;
    await pool.promise().query(createMaintenanceTableQuery);

    const mailTableName = `${org_code}_mail`;
    const createMailTableQuery = `CREATE TABLE ${mailTableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_received ENUM('yes', 'no') DEFAULT 'no',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        informant_id VARCHAR(36),
        room_id INT,
        FOREIGN KEY (informant_id) REFERENCES _User(id),
        FOREIGN KEY (room_id) REFERENCES ${roomTableName}(id)
    )`;
    await pool.promise().query(createMailTableQuery);


}

// CREATE
router.post('/organizations', async (req, res) => {
    const { name, street_address, city, state_province, postal_code, country, email, phone, description } = req.body;

    try {
        let org_code;
        let uniqueIdFound = false;

        // Loop until a unique UUID is found
        while (!uniqueIdFound) {
            org_code = uuid.v4().replace(/-/g, ''); // Generate a new UUID without hyphens
            const checkQuery = 'SELECT COUNT(*) AS count FROM _Organization WHERE org_code = ?';
            const [rows] = await pool.promise().query(checkQuery, [org_code]); // Using promise-based version
            if (rows[0].count === 0) {
                uniqueIdFound = true; // Set flag to exit loop
            }
        }

        const query = 'INSERT INTO _Organization (org_code, name, street_address, city, state_province, postal_code, country, email, phone, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await pool.promise().query(query, [org_code, name, street_address, city, state_province, postal_code, country, email, phone, description]); // Using promise-based version
        await createOrganizationTables(org_code);
        return res.status(200).json({ message: 'Organization registered successfully' });
    } catch (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// READ
router.get('/organizations', async (req, res) => {
    try {
        const query = 'SELECT * FROM _Organization';
        const [results] = await pool.promise().query(query);
        return res.status(200).json(results);
    } catch (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// UPDATE
router.put('/organizations/:org_code', async (req, res) => {
    const org_code = req.params.org_code;
    const { name, street_address, city, state_province, postal_code, country, email, phone, description } = req.body;

    try {
        const query = 'UPDATE _Organization SET name = ?, street_address = ?, city = ?, state_province = ?, postal_code = ?, country = ?, email = ?, phone = ?, description = ? WHERE org_code = ?';
        await pool.promise().query(query, [name, street_address, city, state_province, postal_code, country, email, phone, description, org_code]);

        return res.status(200).json({ message: 'Organization updated successfully' });
    } catch (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// DELETE
router.delete('/organizations/:org_code', async (req, res) => {
    const org_code = req.params.org_code;

    try {
        // Update org_code to null in _User table
        await pool.promise().query('UPDATE _User SET org_code = NULL WHERE org_code = ?', [org_code]);

        // Drop the bill table associated with the organization
        const billTableName = `${org_code}_bill`;
        const maintenanceTableName = `${org_code}_maintenance`;
        const announcementTableName = `${org_code}_announcement`;
        await pool.promise().query(`DROP TABLE IF EXISTS \`${billTableName}\``);
        await pool.promise().query(`DROP TABLE IF EXISTS \`${announcementTableName}\``);
        await pool.promise().query(`DROP TABLE IF EXISTS \`${maintenanceTableName}\``);

        // Finally, delete the organization itself
        const deleteOrgQuery = 'DELETE FROM _Organization WHERE org_code = ?';
        await pool.promise().query(deleteOrgQuery, [org_code]);

        return res.status(200).json({ message: 'Organization and associated tables deleted successfully' });
    } catch (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});


module.exports = { router }; 