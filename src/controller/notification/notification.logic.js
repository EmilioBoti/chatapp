const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")


const acceptFriendRequest = (req, res) => {
    const { notificationId, fromU, toU } = req.body

    try {
        const query = `UPDATE notificationstack SET accepted = 1 WHERE id = '${notificationId}'`
        
        const isRoomExists = `SELECT COUNT(*) as room FROM userroom
        WHERE (userId = '${fromU}'
               AND otherUserId = '${toU}'
              OR 
               userId = '${toU}'
               AND otherUserId = '${fromU}'
              )`

        mysql.query(`${query};${isRoomExists}`, (err, results) => {
            if(err) throw err
            
            if(results[1][0].room <= 0 ) {
                const roomId = geneId()
                const query = `CALL createRoom('${roomId}', '${fromU}', '${toU}')`
                
                mysql.query(query, (err, result) => {
                    if(err) throw err
                    res.status(201).json({
                        accepted: true,
                        roomId
                    })
                })
            } else {
                res.status(201).json({
                    accepted: true
                })
            }

        })

    } catch (err) {
        console.error(err)
        res.status(500).json(null)
    }

}

const rejectFriendRequest = (req, res) => {
    const { notificationId } = req.body

    try {
        const query = `DELETE FROM notificationstack WHERE id = ?`
        
        mysql.query(query,[notificationId] ,(err, results) => {
            if(err) throw err
            
            res.status(201).json({
                accepted: false
            })

        })

    } catch (err) {
        console.error(err)
        res.status(500).json(null)
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
    getNotifications,
    acceptFriendRequest, 
    rejectFriendRequest
}