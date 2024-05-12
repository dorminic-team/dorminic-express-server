const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const uuid = require('uuid');
const pool = require('../config/pool');

const { router: billsRouter } = require('./features/bills');
const { router: announcementsRouter } = require('./features/announcement');
const { router: maintenanceRouter } = require('./features/maintenance');
const { router: usermanagementRouter } = require('./features/usermanagement');
router.use('/bills', billsRouter);
router.use('/announcements', announcementsRouter);
router.use('/maintenance', maintenanceRouter);
router.use('/organization', usermanagementRouter);

module.exports = { router }; 