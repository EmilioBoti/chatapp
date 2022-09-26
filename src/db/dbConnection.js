const mysql = require('mysql')


const connDB = mysql.createPool({
    database: 'chatapp',
    user: 'root',
    host: 'localhost',
    password: '',
})


connDB.getConnection((err)=>{
    if(err) throw err
    console.log('data base connected...')
})
module.exports = connDB