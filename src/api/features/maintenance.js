const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const pool = require('../../config/pool');

router.post('/', async (req, res) => {
    const { org_code, title, description, is_fixed, informant_id } = req.body;
    try {
        const maintenanceTableName = `${org_code}_maintenance`;
        const query = `INSERT INTO ${maintenanceTableName} (title, description, is_fixed, informant_id) VALUES (?, ?, ?, ?)`;
        await pool.promise().query(query, [title, description, is_fixed, informant_id]);

        return res.status(200).json({ message: 'Maintenance created successfully' });
    } catch (err) {
        console.error('Error creating maintenance:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Read all maintenance records
router.get('/', async (req, res) => {
    const { org_code } = req.body;
    try {
        const maintenanceTableName = `${org_code}_maintenance`;
        const query = `SELECT * FROM ${maintenanceTableName}`;
        const [rows] = await pool.promise().query(query);

        return res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching maintenance records:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Update a maintenance record
router.put('/:id', async (req, res) => {
    const { org_code } = req.query;
    const { id } = req.params;
    const { title, description, is_fixed, informant_id } = req.body;

    try {
        const maintenanceTableName = `${org_code}_maintenance`;
        const query = `UPDATE ${maintenanceTableName} SET title=?, description=?, is_fixed=?, informant_id=? WHERE id=?`;
        await pool.promise().query(query, [title, description, is_fixed, informant_id, id]);

        return res.status(200).json({ message: 'Maintenance updated successfully' });
    } catch (err) {
        console.error('Error updating maintenance:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Delete a maintenance record
router.delete('/:id', async (req, res) => {
    const { org_code } = req.query;
    const { id } = req.params;

    try {
        const maintenanceTableName = `${org_code}_maintenance`;
        const query = `DELETE FROM ${maintenanceTableName} WHERE id=?`;
        await pool.promise().query(query, [id]);

        return res.status(200).json({ message: 'Maintenance deleted successfully' });
    } catch (err) {
        console.error('Error deleting maintenance:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

module.exports = { router };