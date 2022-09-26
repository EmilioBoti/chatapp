const mysql = require("../../db/dbConnection") 

const { NOTIFY } = require("../utils/const")

const friendRequest = (user, io) => { 
    
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
        const query = `SELECT users.id, users.name,
        users.socket_id, users.email,
        notificationstack.dateCreated,
        notificationstack.accepted
        FROM notificationstack
        INNER JOIN register_user
        ON register_user.id = notificationstack.toU
        INNER JOIN register_user as users 
        ON users.id = notificationstack.fromU
        WHERE (notificationstack.toU = ?
               AND notificationstack.accepted = false)
        GROUP BY users.id
        `
        
        mysql.query(query, [id] ,(err, result) => {
            if(err) throw err

            result.forEach(element => {
                element.accepted === 1 ? element.accepted = true : element.accepted = false 
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