const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const dayjs = require("dayjs")

const { encrypting, decrypt } = require("../utils/encryting")
const { archiveRoomMessages, archiveUserContacts, searchUsers } = require("../../services/chatServices/chatService")

const getMessages = (req, res) => {
    const { roomId } = req.params

    archiveRoomMessages(roomId, (obj) => {
        if (obj.OK) {
            obj.body.forEach(item => {
                item.message = decrypt({ "iv": item.smsHash, "content": item.message })
                return item
            })
            res.status(201).json(obj)
        }
    })

}

const getContacts = async (req, res) => {
    const id = req.params.id

    archiveUserContacts(id, (obj) => {
        if (obj.OK) {
            obj.body.forEach((item) => {
                if (item.lastMessage !== null || item.smsHash !== null) {
                    item.times = dayjs(item.times).format('HH:mm a')
                    item.lastMessage = decrypt({ "iv": item.smsHash, "content": item.lastMessage })
                }
            })
            res.status(201).json(obj)
        } else {
            res.status(400).json(obj)
        }
    })
}

const findUser = async (req, res) => {
    const user = req.params.user

    searchUsers(user, (obj) => {
        res.status(201).json(obj)
    })
}

const createRoom = (req, res) => {
    const room = req.body

    try {
        const query = `CALL createRoom('${geneId()}', '${room.firstU}', '${room.secondU}')`

        mysql.query(query, (err, result) => {
            if (err) throw err
            res.status(201).json(result)
        })

    } catch (error) {
        res.status(500).json(null)
    }

}

const insertMessage = async (data, io) => {
    if (data.message !== "" || data.message !== null) {

        const time = dayjs().format()
        const message = {
            ...data,
            times: dayjs().format('HH:mm a')
        }
        if (message.messageId === null || message.messageId === undefined) {
            message.messageId = geneId()
        }

        const hash = encrypting(message.message)
        try {
            const query = `INSERT INTO message (id, from_u_id, to_u_id, message, date_created, room_id, smsHash)
            VALUES (?,?,?,?,CURRENT_TIMESTAMP,?,?)`

            mysql.query(query, [message.messageId, message.fromU, message.toU, hash.content, message.roomId, hash.iv], (err, result) => {
                if (err) throw err
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
        WHERE id = ?`

        mysql.query(query, [message.toU], (err, result) => {
            if (err) throw err
            io.to(result[0].socket).emit("message", JSON.stringify(message))
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    findUser,
    createRoom,
    getContacts,
    getMessages,
    insertMessage
}