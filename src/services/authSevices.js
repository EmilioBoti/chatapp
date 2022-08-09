const mysql = require('../db/dbConnection')


const resgisterUser = (user) => new Promise((reject , resolve) => {

    try {
        const query = `INSERT INTO register_user (id, email, pw, iv, date_created)
        values("${user.id}", "${user.email}", "${user.pw}", "${user.iv}", CURRENT_TIMESTAMP)
        `
        mysql.query(query, (error, result) => {
            if(error) throw error
            resolve(result)
        })     
    } catch (error) {
        console.log(error)
        reject(error)
    }
})


module.exports = {
    resgisterUser
}