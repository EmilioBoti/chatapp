const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const dayjs = require("dayjs")

const { encrypting, decrypt } = require("../utils/encryting")
const { archiveRoomMessages, queryUserChats, searchUsers, saveMessage } = require("../../services/chatServices/chatService")


const getMessages = (req, res) => {
    const { roomId } = req.params

    archiveRoomMessages(roomId, (obj) => {
        if (obj.OK) {
            obj.body.forEach(item => {
                item.message = decrypt({ "iv": item.smsHash, "content": item.message })
                return item
            })
            res.status(201).json(obj.body)
        } else {
            res.status(501).json(obj.body)
        }
    })

}

const getContacts = async (req, res) => {
    const user = req.user
    
    queryUserChats(user.id).then( users => {
        users.forEach((item) => {
            if (item.lastMessage !== null || item.smsHash !== null) {
                item.lastMessage = decrypt({ "iv": item.smsHash, "content": item.lastMessage })
            }
        })
        res.status(201).json(users)

    }).catch( err => {
        res.status(err.status).json(err)
    })
}

const findUser = async (req, res) => {
    const user = req.params.user

    searchUsers(user, (obj) => {
        res.status(201).json(obj.body)
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

const insertMessage = async (data, fun) => {
    if (data.message !== " " || data.message !== null) {
        const time = dayjs().toISOString()
        const message = {
            ...data,
            times: time
        }
        if (message.messageId === null || message.messageId === undefined) {
            message.messageId = geneId()
        }

        const hash = encrypting(message.message)

        saveMessage(message, hash, (isInserted) => {
            fun(isInserted, message)
        })

    }
}

module.exports = {
    findUser,
    createRoom,
    getContacts,
    getMessages,
    insertMessage
}