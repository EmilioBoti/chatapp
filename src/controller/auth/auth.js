const { v4: geneId } = require("uuid")
const mysql = require("../../db/dbConnection")
const bcrypt = require("bcryptjs")
const { sendingMail } = require("../../email/email")

const { createToken } = require("../utils/jwt")
const { validCredencials, updateUserSocket, registerNewUser } = require("../../services/authServices/authService")
const { removeBearerToken } = require("../utils/helpers")
const jwt = require("jsonwebtoken")
const { Error } = require("../../services/entity/apiError")

const regexEmail = /(^\w+)(\@{1})([a-zA-Z]+)(\.)[a-zA-Z]+/

const Enum = {
    SUCCESS: "Success",
    FAIL: "Fail"
}

const signUpUser = async (req, res) => {
    const passW = await bcrypt.hash(req.body.pw, 8)

    const user = {
        id: geneId(),
        name: req.body.name,
        email: req.body.email,
        pw: passW
    }

    if (validEmail(user.email)) {

        registerNewUser(user).then( data => {
            res.status(200).json({
                ...data,
                token: createToken({
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
            })
            // sendingMail(user)
        }).catch( err => {
            res.status(err.status).json(err)
        })
    } else {
        res.status(400).json(Error("email", "the email is incorret.", 400))
    }

}

const login = async (req, res) => {

    const { email, pw } = req.body

    if (validEmail(email)) {
        
        validCredencials(email, pw).then( data => {
            res.status(200).json({
                ...data,
                token: createToken({
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
            })
        }).catch( err => {
            res.status(err.status).json(err)
        })

    } else {
        res.status(400).json(Error("email", "the email is incorret.", 400))
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
    signUpUser,
    login,
    updateSocket
}