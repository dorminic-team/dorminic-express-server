const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const pool = require('../../config/pool');

// Create a new room
router.post('/', async (req, res) => {
    const { org_code, name, description, is_active, tenant_id } = req.body;
    const roomTableName = `${org_code}_room`;
    try {
        const createRoomQuery = `
            INSERT INTO ${roomTableName} (name, description, is_active, tenant_id)
            VALUES (?, ?, ?, ?)
        `;
        const values = [name, description, is_active, tenant_id];
        await pool.promise().query(createRoomQuery, values);
        res.status(201).send('Room created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating room');
    }
});

// Get all rooms for a specific organization
router.get('/:org_code', async (req, res) => {
    const org_code = req.params.org_code;
    const roomTableName = `${org_code}_room`;
    
    try {
        const getAllRoomsQuery = `
            SELECT r.*, u.firstname, u.lastname 
            FROM ${roomTableName} r
            LEFT JOIN _User u ON r.tenant_id = u.id
        `;
        const [rows, fields] = await pool.promise().query(getAllRoomsQuery);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching rooms');
    }
});

// Get a specific room by ID
router.get('/:org_code/:id', async (req, res) => {
    const org_code = req.params.org_code;
    const roomId = req.params.id;
    const roomTableName = `${org_code}_room`;
    try {
        const getRoomQuery = `
            SELECT * FROM ${roomTableName}
            WHERE id = ?
        `;
        const [rows, fields] = await pool.promise().query(getRoomQuery, [roomId]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Room not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching room');
    }
});

// Update a specific room by ID
router.put('/:org_code/:id', async (req, res) => {
    const org_code = req.params.org_code;
    const roomId = req.params.id;
    const { name, description, is_active, tenant_id } = req.body;
    const roomTableName = `${org_code}_room`;
    try {
        const updateRoomQuery = `
            UPDATE ${roomTableName}
            SET name = ?, description = ?, is_active = ?, tenant_id = ?
            WHERE id = ?
        `;
        const values = [name, description, is_active, tenant_id, roomId];
        await pool.promise().query(updateRoomQuery, values);
        res.send('Room updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating room');
    }
});

// Delete a specific room by ID
router.delete('/:org_code/:id', async (req, res) => {
    const org_code = req.params.org_code;
    const roomId = req.params.id;
    const roomTableName = `${org_code}_room`;
    try {
        const deleteRoomQuery = `
            DELETE FROM ${roomTableName}
            WHERE id = ?
        `;
        await pool.promise().query(deleteRoomQuery, [roomId]);
        res.send('Room deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting room');
    }
});

// Remove tenant from a specific room
router.delete('/:org_code/:id/tenant', async (req, res) => {
    const org_code = req.params.org_code;
    const roomId = req.params.id;
    const roomTableName = `${org_code}_room`;
    try {
        const removeTenantQuery = `
            UPDATE ${roomTableName}
            SET tenant_id = NULL
            WHERE id = ?
        `;
        await pool.promise().query(removeTenantQuery, [roomId]);
        res.send('Tenant removed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error removing tenant');
    }
});

// Disable a specific room
router.post('/:org_code/:id/disable', async (req, res) => {
    const org_code = req.params.org_code;
    const roomId = req.params.id;
    const roomTableName = `${org_code}_room`;
    try {
        const disableRoomQuery = `
            UPDATE ${roomTableName}
            SET is_active = 'no'
            WHERE id = ?
        `;
        await pool.promise().query(disableRoomQuery, [roomId]);
        res.send('Room disabled successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error disabling room');
    }
});

router.post('/:org_code/:id/enable', async (req, res) => {
    const org_code = req.params.org_code;
    const roomId = req.params.id;
    const roomTableName = `${org_code}_room`;
    try {
        const disableRoomQuery = `
            UPDATE ${roomTableName}
            SET is_active = 'yes'
            WHERE id = ?
        `;
        await pool.promise().query(disableRoomQuery, [roomId]);
        res.send('Room disabled successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error disabling room');
    }
});

// Assign tenant to a room
router.post('/assignTenant', async (req, res) => {
    const org_code = req.body.org_code;
    const roomId = req.body.roomId;
    const { tenant_id } = req.body;
    const roomTableName = `${org_code}_room`;
    try {
        const assignTenantQuery = `
            UPDATE ${roomTableName}
            SET tenant_id = ?
            WHERE id = ?
        `;
        const values = [tenant_id, roomId];
        await pool.promise().query(assignTenantQuery, values);
        res.send('Tenant assigned successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error assigning tenant');
    }
});

module.exports = {router};
