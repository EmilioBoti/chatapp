const jwt = require("jsonwebtoken")

const exp = 1000

const Enum = {
    UNVALID: 0,
    VALID: 1,
    TIME_EXP: 2
}

const cutter = 7

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWTKEY, {
        expiresIn: exp
    })
}

const isValidToken = (token) => {
    let isValid = {}
    try {
        let payload = jwt.verify(token.slice(cutter), process.env.JWTKEY)
        if (payload !== undefined) {
            isValid = {
                isValid: Enum.VALID,
                payload
            }
        } else {
            isValid = {
                isValid: Enum.UNVALID,
                payload: null
            }
        }

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            isValid = {
                isValid: Enum.TIME_EXP,
                payload: null
            }
        }
    }
    return isValid
}

module.exports = {
    createToken,
    isValidToken
}