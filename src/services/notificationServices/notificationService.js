const mysql = require("../../db/dbConnection")


const { notificationQuery } = require("./notiQueries")

const getUserNotifications = (id, fun)=> {
    try {
        mysql.query(notificationQuery, [id] ,(err, result) => {
            if(err) throw err

            result.forEach(element => {
                element.state === 1 ? element.state = true : element.state = false
            });
            fun({
                OK: true,
                body: result
            })
        })   
        
    } catch (error) {
        fun({
            OK: false,
            body: null
        })
    }
}

module.exports = {
    getUserNotifications
}
