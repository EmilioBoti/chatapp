const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const bcrypt = require("bcryptjs")
const { getRooms } = require("../../services/user.service")



const getMessages = (req, res) => {
    const { roomId } = req.params

    try {
        const query = `SELECT message.room_id as roomId, message.id as messageId, register_user.id as userId,
        register_user.name as userName, message.message, message.date_created 
        FROM message
        INNER JOIN register_user 
        ON register_user.id = message.from_u_id
        WHERE room_id = '${roomId}'`

        mysql.query(query, (err, result) => {
            if(err) throw err
            res.status(201).json(result)
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
        register_user.email
        FROM userroom 
        INNER JOIN register_user
        ON register_user.id = userroom.userId
        INNER JOIN register_user as users
        ON users.id = userroom.otherUserId
        WHERE users.id = "${id}"`

        mysql.query(query, (err, result) => {
            if(err) throw err
            res.status(201).json(result)
         })

    } catch (error) {
        res.status(500).json(null)
    }
}

const findUser =  (req, res) => {
    const user = req.params.user

    try {
        const query = `SELECT * FROM register_user WHERE (email LIKE '${user}%' OR name LIKE '${user}%')`

        mysql.query(query, (err, result) => {
            if(err) throw err
            res.status(201).json(result)
         })

    } catch (error) {
        res.status(500).json(null)
    }

}

const createRoom =  (req, res) => {
    const room = req.body
    
    try {
        const query = `CALL createRoom('${geneId()}', '${room.firstU}', '${room.secondU}') `

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
        try {
            const query = `INSERT INTO message (id, from_u_id, to_u_id, message, date_created, room_id)
            VALUES ('${geneId()}','${data.from}','${data.to}',"${data.message}",CURRENT_TIMESTAMP,'${data.roomId}')`
    
            mysql.query(query, (err, result) => {
                if(err) throw err
                returnMesage(data, io)
            })
    
        } catch (error) {
            console.log(error)   
        }
    }
}

const returnMesage = (data, io) => {
    try {
        const query = `SELECT socket_id as socket FROM register_user
        WHERE (id = '${data.from}' OR id = '${data.to}')`

        mysql.query(query, (err, result) => {
            if(err) throw err
            io.to(result[0].socket).to(result[1].socket).emit("message", data)
        })

    } catch (error) {
        console.log(error)        
    }
}

module.exports = {
    getRooms,
    findUser,
    createRoom,
    getContacts,
    getMessages
}