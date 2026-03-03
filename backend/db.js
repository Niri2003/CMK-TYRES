const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Default XAMPP user
    password: '',     // Default XAMPP password is empty
    database: 'cmktyres'
});

module.exports = pool.promise();