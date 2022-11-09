const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const bcrypt = require("bcryptjs")
const {sendingMail } = require("../../email/email")


const register =  async (req, res) => {
    const passW = await bcrypt.hash(req.body.pw, 8)

    const user = {
        id: geneId(),
        name: req.body.name,
        email: req.body.email,
        pw: passW
    }
    
    try {
        const query = `INSERT INTO register_user (id, name , email, pw, date_created)
        values("${user.id}", "${user.name}","${user.email.toLowerCase()}", "${user.pw}", CURRENT_TIMESTAMP)
        `
        mysql.query(query, (error, result) => {
        
            if(error) throw error
            sendingMail()
            res.status(201).json({
                OK: true,
                body: user
            })   
          
        })     
    } catch (error) {
        res.status(500)
        .json({
            OK: false,
            body: { }
        })
    } 
}

const login =  async (req, res) => {
    
    try {
        const query = `SELECT id, name, email, pw, socket_id FROM register_user WHERE email = ?`
        mysql.query(query, [req.body.email] ,async (error, result) => {    
            if(error) throw error

            if(result.length !== 0) {

                const hash = await bcrypt.compare(req.body.pw, result[0].pw)
                
                if(hash) {
                    response(res, 201, {
                        OK: true,
                        body: {
                            "id": result[0].id,
                            "name": result[0].name,
                            "email": result[0].email,
                            "socketId": result[0].socket_id
                        }
                    })   
                } else {
                    response(res, 401, {
                        OK: false,
                        body: null
                    })
                }
            } else {
                response(res, 400,{
                    OK: false,
                    body: null
                })
            }

        })     
    } catch (error) {
        response(res, 500, {
            OK: false,
            body: null
        })
    }
}

const response = (res, status, object) => {
    res.status(status).json(object)
}

const updateSocket = (id, socketId) => {
    try {
        const query = `UPDATE register_user SET socket_id = ? WHERE id = ?`
        mysql.query(query,[socketId, id] ,(err, result) =>{
            if(err) throw err
        })
        
    } catch (error) {
        throw error
    }
    
}

module.exports = {
    register,
    login, 
    updateSocket
}