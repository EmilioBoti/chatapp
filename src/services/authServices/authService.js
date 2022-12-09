const mysql = require("../../db/dbConnection")

const bcrypt = require("bcryptjs")

const { loginQuery, updateSocketQuery, insertUserQuery } = require("./authQueries")

/**
 * 
 * @param {*} user the new User to register
 * @param {*} registerCallBack
 */

const registerNewUser = (user, registerCallBack) => {
    try {
        mysql.query(insertUserQuery, [user.id, user.name, user.email.toLowerCase(), user.pw], (error, result) => {
            if (error) {
                registerCallBack({
                    OK: false,
                    body: null
                })
            } else {
                registerCallBack({
                    OK: true,
                    body: user
                })
            }
        })
    } catch (error) {
        registerCallBack({
            OK: false,
            body: null
        })
    }
}

/**
 * 
 * @param {*} email User email
 * @param {*} pw User passwork
 * @param {*} fun CallBack
 */
const validCredencials = (email, pw, fun) => {
    try {
        mysql.query(loginQuery, [email], async (error, result) => {
            if (error) throw error

            const obj = {
                OK: false,
                errorMessage: "",
                body: null
            }

            if (result.length > 0) {
                const hash = await bcrypt.compare(pw, result[0].pw)

                if (hash) {
                    obj.OK = true,
                    obj.body = {
                        "id": result[0].id,
                        "name": result[0].name,
                        "email": result[0].email,
                        "socketId": result[0].socket_id,
                    }
                }
            }
            fun(obj)
        })

    } catch (error) {
        fun({
            OK: false,
            body: null
        })
    }

}

/**
 * 
 * @param {*} id User Id
 * @param {*} socketId User Id Socket
 * @param {*} fun CallBack
 */
const updateUserSocket = (id, socketId, fun) => {
    try {
        mysql.query(updateSocketQuery, [socketId, id], (err, result) => {
            if (err) throw err
        })

    } catch (error) {
        throw error
    }
}


module.exports = {
    validCredencials,
    updateUserSocket,
    registerNewUser
}