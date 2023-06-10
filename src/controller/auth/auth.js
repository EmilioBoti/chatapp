const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const bcrypt = require("bcryptjs")
const { sendingMail } = require("../../email/email")

const { createToken } = require("../utils/jwt")
const { validCredencials, updateUserSocket, registerNewUser } = require("../../services/authServices/authService")
const { removeBearerToken } = require("../utils/helpers")
const jwt = require("jsonwebtoken")

const regexEmail = /(^\w+)(\@{1})([a-zA-Z]+)(\.)[a-zA-Z]+/

const Enum = {
    SUCCESS: "Success",
    FAIL: "Fail"
}

const register = async (req, res) => {
    const passW = await bcrypt.hash(req.body.pw, 8)

    const user = {
        id: geneId(),
        name: req.body.name,
        email: req.body.email,
        pw: passW
    }

    if (validEmail(user.email)) {

        registerNewUser(user, (data) => {
            if (data.OK) {
                const token = createToken({
                    id: data.body.id,
                    name: data.body.name,
                    email: data.body.email
                })
                sendingMail(user)
                res.status(201).json({
                    OK: true,
                    message: Enum.SUCCESS,
                    user: { 
                        id: data.body.id,
                        name: data.body.name,
                        email: data.body.email
                    },
                    token: token
                })
            } else {
                res.status(500).json({
                    OK: false,
                    message: Enum.FAIL,
                    user: null,
                    token: null
                })
            }
        })
        
    } else {
        res.status(400).json({
            OK: false,
            errorMessage: Enum.FAIL,
            token: null
        })
    }

}

const login = async (req, res) => {

    const { email, pw } = req.body

    if (validEmail(email)) {

        validCredencials(email, pw, (data) => {
            if (data.OK) {
                const token = createToken({
                    id: data.body.id,
                    name: data.body.name,
                    email: data.body.email
                })

                res.status(201).json({
                    OK: true,
                    message: Enum.SUCCESS,
                    user: { 
                        id: data.body.id,
                        name: data.body.name,
                        email: data.body.email
                    },
                    token: token
                })
            } else {
                res.status(400).json({
                    OK: false,
                    message: Enum.FAIL,
                    user: null,
                    token: null
                })
            }
        })

    } else {
        res.status(400).json({
            OK: false,
            message: Enum.FAIL,
            token: null
        })
    }

}


const updateSocket = (token, socketId) => {
    try {
        if (!token) return
        
        const payload = jwt.verify(removeBearerToken(token), process.env.JWTKEY)
        updateUserSocket(payload.id, socketId, () => { })
    } catch (error) {
        console.log(error)
    }
}

function validEmail(email) {
    return regexEmail.test(email)
}


module.exports = {
    register,
    login,
    updateSocket
}