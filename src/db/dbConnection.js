const mysql = require('mysql')


const connDB = mysql.createPool({
    database: 'chatapp',
    user: 'root',
    host: 'localhost',
    password: ''
})

module.exports = connDB