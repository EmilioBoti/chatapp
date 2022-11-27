const mysql = require("../../db/dbConnection")
const dayjs = require("dayjs")
const { encrypting, decrypt } = require("../../controller/utils/encryting")


const { queryUserContacts, queryGetMessages, queryFindUser, queryInsertSms, querySingleUser } = require("./chatQueries")

/**
 * 
 * @param {*} roomId Chat's id
 * @param {*} fun callback
 */
const archiveRoomMessages = (roomId, fun) => {
    try {
        mysql.query(queryGetMessages, [roomId], (err, result) => {
            if (err) throw err

            fun({
                OK: true,
                body: result
            })
        })

    } catch (err) {
        console.error(err)
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
const archiveUserContacts = (id, fun) => {
    try {
        mysql.query(queryUserContacts, [id], (err, result) => {
            if (err) {
                fun({
                    OK: true,
                    body: []
                })
            } else {
                fun({
                    OK: true,
                    body: result
                })
            }
        })

    } catch (error) {
        fun({
            OK: false,
            body: []
        })
    }
}

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


module.exports = {
    archiveRoomMessages,
    archiveUserContacts,
    searchUsers
}