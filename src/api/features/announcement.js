const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const pool = require('../../config/pool');

// READ all announcements by org_code
router.get('/', async (req, res) => {
    try {
        const { org_code } = req.body;
        const announcementTableName = `${org_code}_announcement`;
        const query = `SELECT * FROM ${announcementTableName}`;
        const [results] = await pool.promise().query(query);

        return res.status(200).json(results);
    } catch (err) {
        console.error('Error retrieving announcements by org_code:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// UPDATE announcement
router.put('/:announcement_id', async (req, res) => {
    const { org_code } = req.body;
    const announcement_id = req.params.announcement_id;
    const { title, description, cost, is_paid, informant_id } = req.body;

    try {
        const billTableName = `${org_code}_bill`;
        const query = `UPDATE ${billTableName} SET title = ?, description = ?, cost = ?, is_paid = ?, informant_id = ? WHERE id = ?`;
        await pool.promise().query(query, [title, description, cost, is_paid, informant_id, bill_id]);

        return res.status(200).json({ message: 'Bill updated successfully' });
    } catch (err) {
        console.error('Error updating bill:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// DELETE bill
router.delete('/:bill_id', async (req, res) => {
    const { org_code } = req.body;
    const bill_id = req.params.bill_id;

    try {
        const billTableName = `${org_code}_bill`;
        const query = `DELETE FROM ${billTableName} WHERE id = ?`;
        await pool.promise().query(query, [bill_id]);

        return res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (err) {
        console.error('Error deleting bill:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

module.exports = { router };