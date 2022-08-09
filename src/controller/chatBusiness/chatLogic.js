const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const bcrypt = require("bcryptjs")
const { getRooms } = require("../../services/user.service")


const getContacts = async (req, res) => {
    const id = req.params.id

    try {
        const query = `SELECT rooms.id as roomId, register_user.id,
        register_user.socket_id as socketId, register_user.name,
        register_user.email
        FROM rooms
        INNER JOIN register_user as users
        ON users.id = rooms.user_id
        INNER JOIN register_user 
        ON register_user.id = rooms.other_u_id
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


// be38cc8f-dbab-4c2e-91f2-dc6cd16c5e2c //EMILIO ID

// af03a2cb-4816-4ace-9a8b-e0494ce979a4 // LUIS ID

const createRoom =  (req, res) => {
    const room = req.body
    
    try {
        const query = `INSERT INTO rooms (id, user_id, other_u_id) 
        VALUES ('${geneId()}','${room.firstU}','${room.secondU}')`

        mysql.query(query, (err, result) => {
            if(err) throw err
            res.status(201).json(result)
        })

    } catch (error) {
        res.status(500).json(null)
    }

}

module.exports = {
    getRooms,
    findUser,
    createRoom,
    getContacts
}