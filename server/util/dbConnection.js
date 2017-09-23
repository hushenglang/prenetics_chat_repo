/**
 * Database connection pool
 * @author JoeHu
 * @date 2017-Sep-23
 */

'use strict';

const mysql = require('promise-mysql');
const config = require("../../config");
const log4js = require('log4js');
const log = log4js.getLogger("dbConnection");

const pool = mysql.createPool({
    host: config.mysql.url,
    user: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.database,
    connectionLimit: config.mysql.maxConnections
});
log.info("start mysql connection...");
exports.pool = pool;