const mysql = require('mysql2')


const connDB = mysql.createPool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    multipleStatements: true
})


connDB.getConnection((err)=>{
    if(err) throw err
    console.log('data base connected...')
})
module.exports = connDB