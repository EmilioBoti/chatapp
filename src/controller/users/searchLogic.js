const mysql = require("../../db/dbConnection") 

const { NOTIFY } = require("../utils/const")

const friendRequest = (user, io) => { 
    
    try {
        const checkQuery = `SELECT COUNT(*) as isExists FROM notificationstack
        WHERE (fromU = '${user.fromU}' AND toU = '${user.toU}')`

        mysql.query(checkQuery, (err, result) => {
            if(err) throw err

            if(result[0].isExists === 0) {
                insertNotification(user, io)
            } else {
                io.to(user.toSocketId).emit(NOTIFY, null)
            }
        }) 
    } catch (error) {
        
    }

}

const insertNotification = (user, io) => {
    try {
        
        const query = `INSERT INTO notificationstack (id, type, fromU, toU, accepted, dateCreated)
        VALUES ('${user.id}', (SELECT id FROM notificationtype WHERE id = 1),
        '${user.fromU}', '${user.toU}',
        ${user.accepted}, CURRENT_TIMESTAMP)`
        
        mysql.query(query, (err, result) => {
            if(err) throw err
            io.to(user.toSocketId).emit(NOTIFY, user)
        })   
    } catch (error) {
        
    }
}

module.exports = {
    friendRequest
}