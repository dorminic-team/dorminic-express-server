const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const pool = require('../../config/pool');
// CREATE bill
router.post('/', async (req, res) => {
    const { org_code, title, description, cost, is_paid, informant_id, customer_id, room_id } = req.body;

    try {
        const billTableName = `${org_code}_bill`;
        const query = `INSERT INTO ${billTableName} (title, description, cost, is_paid, informant_id, customer_id, room_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await pool.promise().query(query, [title, description, cost, is_paid, informant_id, customer_id, room_id]);

        return res.status(200).json({ message: 'Bill created successfully' });
    } catch (err) {
        console.error('Error creating bill:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// READ all bills by org_code
router.get('/:org_code', async (req, res) => {
    try {
        const { org_code } = req.params;
        const billTableName = `${org_code}_bill`;
        const query = `SELECT * FROM ${billTableName}`;
        const [results] = await pool.promise().query(query);

        return res.status(200).json(results);
    } catch (err) {
        console.error('Error retrieving bills by org_code:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});


router.get('/:org_code/:customer_id', async (req, res) => {
    const  org_code  = req.params.org_code;
    const  customer_id  = req.params.customer_id;

    try {
        const billTableName = `${org_code}_bill`;
        const query = `SELECT * FROM ${billTableName} WHERE customer_id = ?`;
        const [results] = await pool.promise().query(query, [customer_id]);

        return res.status(200).json(results);
    } catch (err) {
        console.error('Error retrieving bills by customer_id:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// UPDATE bill
router.put('/:bill_id', async (req, res) => {
    const { org_code } = req.body;
    const bill_id = req.params.bill_id;
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