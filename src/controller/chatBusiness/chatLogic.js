const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const bcrypt = require("bcryptjs")
const dayjs = require("dayjs")


const { encrypting, decrypt } = require("../../utils/encryting")

const { getRooms } = require("../../services/user.service")

const acceptFriendRequest = (req, res) => {
    const notification = req.body

    try {
        const query = `UPDATE notificationstack SET accepted = 1 WHERE id = '${notification.notificationId}'`
        
        const isRoomExists = `SELECT COUNT(*) as room FROM rooms
        WHERE (user_id = '${notification.fromU}' 
               AND other_u_id = '${notification.toU}'
              OR 
               user_id = '${notification.toU}'
               AND other_u_id = '${notification.fromU}'
              )`

        mysql.query(`${query};${isRoomExists}`, (err, results) => {
            if(err) throw err
            
            if(results[1][0].room <= 0 ) {
                const query = `CALL createRoom('${geneId()}', '${notification.fromU}', '${notification.toU}')`
        
                mysql.query(query, (err, result) => {
                    if(err) throw err
                    res.status(201).json({
                        accepted: true
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

const getMessages = (req, res) => {
    const { roomId } = req.params

    try {
        const query = `SELECT message.room_id as roomId, message.id as messageId, message.from_u_id as fromU,
        message.to_u_id as toU, register_user.name as userName,
        message.message, message.date_created as times, smsHash
        FROM message
        INNER JOIN register_user 
        ON register_user.id = message.from_u_id
        WHERE room_id = ?
        ORDER BY times
        `

        mysql.query(query, [roomId] , (err, result) => {
            if(err) throw err
            const messages = result.map( item =>  {
                item.times = dayjs(item.times).format('HH:mm a')
                item.message = decrypt({ "iv": item.smsHash, "content": item.message })
                return item
            })
            res.status(201).json(messages)
         })

    } catch (error) {
        res.status(500).json(null)
    }

}

const getContacts = async (req, res) => {
    const id = req.params.id

    try {
        const query = `SELECT userroom.roomId, register_user.id,
        register_user.socket_id as socketId, register_user.name,
        register_user.email, message.date_created as dates, 
        (SELECT message.smsHash
            FROM message 
            WHERE message.room_id = userroom.roomId
            ORDER BY message.date_created DESC
            LIMIT 1) as smsHash,
        (SELECT message.message
        FROM message 
        WHERE message.room_id = userroom.roomId
        ORDER BY message.date_created DESC
        LIMIT 1) as lastMessage
        FROM userroom 
        INNER JOIN register_user
        ON register_user.id = userroom.userId
        INNER JOIN register_user as users
        ON users.id = userroom.otherUserId
        LEFT JOIN message 
        ON message.to_u_id = users.id
        WHERE users.id = ?
        GROUP BY register_user.email`

        mysql.query(query, [id] ,(err, result) => {
            if(err) throw err  

            result.forEach( (item) => {
                if(item.lastMessage !== null || item.smsHash !== null) {
                    item.lastMessage = decrypt({ "iv": item.smsHash, "content": item.lastMessage })
                }
            })
            res.status(201).json(result)
         })

    } catch (error) {
        res.status(500).json(null)
    }
}

const findUser =  async (req, res) => {
    const user = req.params.user

    try {
       
        const query = `SELECT id, name, email, socket_id as socketId FROM register_user WHERE (name LIKE '%${user}%' OR name LIKE '%${user}%')`

        const query2 = `SELECT register_user.id, register_user.name,
        register_user.email, register_user.socket_id as socketId,
        notificationstack.accepted as state
        FROM register_user
        LEFT JOIN notificationstack
        ON register_user.id = notificationstack.fromU
        WHERE (register_user.name LIKE '%${user}%')`

        const r = await mysql.query(query, async (err, results,) => {  
            if(err) throw err
            // results.forEach(element => {
            //     if(element.accepted === 1) element.accepted = true
            //     if(element.accepted === 0) element.accepted =  false
            // });
            res.status(201).json(results)
        })

    } catch (error) {
        res.status(500).json(null)
    }
}

const createRoom =  (req, res) => {
    const room = req.body
    
    try {
        const query = `CALL createRoom('${geneId()}', '${room.firstU}', '${room.secondU}')`

        mysql.query(query, (err, result) => {
            if(err) throw err
            res.status(201).json(result)
        })

    } catch (error) {
        res.status(500).json(null)
    }

}

const insertMessage = async (data, io) => {
    if(data.message !== "" || data.message !== null) {

        const time = dayjs().format()
        const message = {
            ...data,
            id: geneId(),
            times: dayjs().format('HH:mm a')
        }
        const hash = encrypting(message.message)

        try {
            const query = `INSERT INTO message (id, from_u_id, to_u_id, message, date_created, room_id, smsHash)
            VALUES (?,?,?,?,?,?,?)`
    
            mysql.query(query,[message.id, message.fromU, message.toU, hash.content, time , message.roomId, hash.iv] ,(err, result) => {
                if(err) throw err
                returnMesage(message, io)
            })
    
        } catch (error) {
            console.log(error)   
        }
    }
}

const returnMesage = async (message, io) => {
    try {
        const query = `SELECT socket_id as socket FROM register_user
        WHERE (id = ? OR id = ?)`

        mysql.query(query,[message.fromU, message.toU],(err, result) => {
            if(err) throw err
            io.to(result[0].socket).to(result[1].socket).emit("message", JSON.stringify(message))
        })
    } catch (error) {
        console.error(error)        
    }
}

module.exports = {
    getRooms,
    findUser,
    createRoom,
    getContacts,
    getMessages,
    insertMessage,
    acceptFriendRequest
}