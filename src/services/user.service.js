const mysql = require('../db/dbConnection')


const getRooms = async () => {
    const query = `SELECT * FROM rooms`
    let res = "okooo"

    mysql.query(query, (err, result) => {
        if(err) throw err

    })

}

module.exports = {
    getRooms
}