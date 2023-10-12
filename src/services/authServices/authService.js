const mysql = require("../../db/dbConnection")

const bcrypt = require("bcryptjs")

const { loginQuery, updateSocketQuery, insertUserQuery } = require("./authQueries")
const { Error } = require("../entity/apiError")

/**
 * 
 * @param {*} user the new User to register
 * @param {*} registerCallBack
 */

const registerNewUser = (user) => new Promise( (resolve, reject) => {
    try {
        mysql.query(insertUserQuery, [user.id, user.name, user.email.toLowerCase(), user.pw], (error, result) => {
            
            if(result === undefined) {
                reject(Error("user_exist", "this user already exist.", 400))
            } else {
                resolve({
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                })
            }
        })
    } catch (error) {
        reject(Error("unknown", "Something went wrong.", 500))
    }
})

/**
 * 
 * @param {*} email User email
 * @param {*} pw User passwork
 * @param {*} fun CallBack
 */
const validCredencials = (email, pw) => new Promise( (resolve, reject) => {
    try {
        mysql.query(loginQuery, [email], async (error, result) => {
            if (error) throw error

            if (result.length > 0) {
                const hash = await bcrypt.compare(pw, result[0].pw)

                if (hash) {
                    resolve({
                        "id": result[0].id,
                        "name": result[0].name,
                        "email": result[0].email,
                    })
                } else {
                    reject(Error("password", "the password is incorrect.", 400))
                }
            } else {
                reject(Error("unknown_user","this user is ot registed.", 404))
            }
        })
    } catch (error) {
        reject(Error("unknown", "Something went wrong.", 500))
    }
}) 
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