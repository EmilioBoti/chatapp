const jwt = require("jsonwebtoken")

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next  
 * @returns 
 */
const authTokenMiddleware = (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json(Error("no_token_provide", "Bad request, require a token.", 401))
    }

    try {
        if (token.includes("Bearer ")) token = token.slice(7)
        const verified = jwt.verify(token, process.env.JWTKEY)
        req.user = verified
        next()
    } catch (err) {
        const error = parseTokenError(err)
        res.status(error.status).json(error)
    }
}

const parseTokenError = (e) => {
    let error

    switch(e.name) {
        case "JsonWebTokenError" :
            error = Error("invalid_token", "", 401)
            break
        case "TokenExpiredError" :
            error = Error("expired_token", "The token has expired.", 401)
            break
        default:
            error = Error("invalid_token", "", 401)
            break
    }
    return error
}

module.exports = {
    authTokenMiddleware
}