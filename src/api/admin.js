const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const uuid = require('uuid');
const pool = require('../config/pool');

const { router: billsRouter } = require('./features/bills');
const { router: announcementsRouter } = require('./features/announcement');
router.use('/bills', billsRouter);
router.use('/announcements', announcementsRouter);


module.exports = { router }; 