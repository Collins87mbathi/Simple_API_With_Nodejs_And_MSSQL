// dbConnection.js

const sql = require('mssql/msnodesqlv8');
const dbConfig = require('./dbconfig');

// Create a connection pool
const pool = new sql.ConnectionPool(dbConfig);
const connection = pool.connect();

module.exports = connection;
