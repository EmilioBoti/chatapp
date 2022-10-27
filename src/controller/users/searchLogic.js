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
const getNotifications = (req, res) => { 

    const id = req.params.id
    
    try {
        const query = `SELECT notificationstack.id as notificationId, notificationstack.fromU as fromU,
        notificationstack.toU as toU,
        users.name, users.socket_id as socketId, users.email,
        notificationstack.dateCreated,
        notificationstack.accepted as state
        FROM notificationstack
        INNER JOIN register_user
        ON register_user.id = notificationstack.toU
        INNER JOIN register_user as users 
        ON users.id = notificationstack.fromU
        WHERE (notificationstack.toU = ?)
        GROUP BY users.id
        LIMIT 15
        `
        
        mysql.query(query, [id] ,(err, result) => {
            if(err) throw err

            result.forEach(element => {
                element.state === 1 ? element.state = true : element.state = false
            });
            res.status(201).json(result)
        })   
        
    } catch (error) {
        res.status(501).json(null)
    } 

}

module.exports = {
    friendRequest,
    getNotifications
}