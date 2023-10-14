const mysql = require("../../db/dbConnection")
const dayjs = require("dayjs")
const { encrypting, decrypt } = require("../../controller/utils/encryting")
const { Error } = require("../../services/entity/apiError")

const { queryUserContacts, queryGetMessages, queryFindUser, queryInsertSms, querySingleUser } = require("./chatQueries")

/**
 * 
 * @param {*} roomId Chat's id
 * @param {*} fun callback
 */
const archiveRoomMessages = (roomId, fun) => {
    try {
        mysql.query(queryGetMessages, [roomId], (err, result) => {
            fun({
                OK: true,
                body: result
            })
        })

    } catch (err) {
        fun({
            OK: false,
            body: []
        })
    }
}

/**
 * 
 * @param {*} id user id 
 * @param {*} fun callback
 */
const queryUserChats = (id) => new Promise((resolve, reject) => {
    try {
        mysql.query(queryUserContacts, [id], (err, result) => {
            if(err) throw err
            resolve(result)
        })

    } catch (error) {
        reject(Error("unknown", "", 500))
    }
})

/**
 * 
 * @param {*} user the user to look for 
 * @param {*} fun callback
 */
const searchUsers = (user, fun) => {
    try {
        mysql.query(queryFindUser, [`%${user}%`], async (err, result) => {
            if (err) throw err

            fun({
                OK: true,
                body: result
            })
        })
    } catch (error) {
        fun({
            OK: true,
            body: []
        })
    }
}

const saveMessage = (message, hash, fun) => {
    try {
        mysql.query(queryInsertSms, [message.messageId, message.fromU, message.toU, hash.content, message.roomId, hash.iv],
            (err, result) => {
                if (err) throw err
                fun(true)
            })

    } catch (error) {
        fun(false)
    }
}

const returnMesage = (message, fun) => {
    try {
        mysql.query(querySingleUser, [message.toU], (err, result) => {
            if (err) throw err
            fun(result[0].socket)
        })
    } catch (error) {
        fun({
            OK: false,
            body: null
        })
    }
}

module.exports = {
    archiveRoomMessages,
    queryUserChats,
    searchUsers,
    saveMessage
}