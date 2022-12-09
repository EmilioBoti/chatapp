const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const dayjs = require("dayjs")

const { encrypting, decrypt } = require("../utils/encryting")
const { archiveRoomMessages, archiveUserContacts, searchUsers, saveMessage } = require("../../services/chatServices/chatService")
const jwt = require("jsonwebtoken")

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
    let token = req.headers.authorization
    if (token.includes("Bearer ")) token = token.slice(7)
    const user = jwt.verify(token, process.env.JWTKEY)

    archiveUserContacts(user.id, (obj) => {
        if (obj.OK) {
            obj.body.forEach((item) => {
                if (item.lastMessage !== null || item.smsHash !== null) {
                    item.times = dayjs(item.times).format('HH:mm a')
                    item.lastMessage = decrypt({ "iv": item.smsHash, "content": item.lastMessage })
                }
            })
            res.status(201).json(obj)
        } else {
            res.status(400).json({
                OK: false,
                body: []
            })
        }
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

        const time = dayjs().format()
        const message = {
            ...data
        }
        if (message.messageId === null || message.messageId === undefined) {
            message.messageId = geneId()
        }

        const hash = encrypting(message.message)

        saveMessage(message, hash, (socketId, data) => {
            fun(socketId, data)
        })

    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next  
 * @returns 
 */
const auth = (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json({
            ok: false,
            error: "Bad request, require a token",
            body: null
        })
    }

    try {
        if (token.includes("Bearer ")) token = token.slice(7)
        const verified = jwt.verify(token, process.env.JWTKEY)
        req.user = verified
        next()
    } catch (err) {
        res.status(401).json({
            ok: false,
            error: "Unauthorized",
            body: null
        })
    }
}

module.exports = {
    findUser,
    createRoom,
    getContacts,
    getMessages,
    insertMessage,
    auth
}