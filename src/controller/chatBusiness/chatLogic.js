const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const bcrypt = require("bcryptjs")
const dayjs = require("dayjs")
const events = require("events")

const { getRooms } = require("../../services/user.service")

const chatEventsEmitter = new events.EventEmitter()


const getMessages = (req, res) => {
    const { roomId } = req.params

    try {
        const query = `SELECT message.room_id as roomId, message.id as messageId, message.from_u_id as fromU,
        message.to_u_id as toU, register_user.name as userName,
        message.message, message.date_created as times
        FROM message
        INNER JOIN register_user 
        ON register_user.id = message.from_u_id
        WHERE room_id = ?
        ORDER BY times
        `

        mysql.query(query, [roomId] ,(err, result) => {
            if(err) throw err
            const messages = result.map( item =>  {
                item.times = dayjs(item.times).format('HH:mm a')
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
        INNER JOIN message 
        ON message.to_u_id = users.id
        WHERE users.id = ?
        GROUP BY register_user.email`

        mysql.query(query, [id] ,(err, result) => {
            if(err) throw err  
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

const insertMessage = (data, io) => {
    if(data.message !== "" || data.message !== null) {

        const time = dayjs().format()
        const message = {
            ...data,
            id: geneId(),
            times: dayjs().format('HH:mm a')
        }

        try {
            const query = `INSERT INTO message (id, from_u_id, to_u_id, message, date_created, room_id)
            VALUES (?,?,?,?,?,?)`
    
            mysql.query(query,[message.id, message.fromU, message.toU, message.message.trim(), time , message.roomId] ,(err, result) => {
                if(err) throw err
                returnMesage(message, io)
            })
    
        } catch (error) {
            console.log(error)   
        }
    }
}

const returnMesage = (message, io) => {
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
    chatEventsEmitter
}