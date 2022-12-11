const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const { getUserNotifications } = require("../../services/notificationServices/notificationService")
const jwt = require("jsonwebtoken")
const { removeBearerToken } = require("../utils/helpers")

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

    let token = req.headers.authorization
    const user = jwt.verify(removeBearerToken(token), process.env.JWTKEY)
    
    getUserNotifications(user.id, (result) => {
        if (result.OK) {
            res.status(201).json(result.body)
        } else {
            res.status(501).json(result.body)
        }
    })

}

module.exports = {
    getNotifications,
    acceptFriendRequest, 
    rejectFriendRequest
}