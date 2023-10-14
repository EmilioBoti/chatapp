const express = require("express")
const router = express.Router()

const { findUser, 
    getContacts,
    getMessages,
    createRoom
} = require("./chatController")

const { authTokenMiddleware } = require("../auth/middleware/authMiddleware")

router.get("/chat/:user", authTokenMiddleware, findUser)
router.get("/contacts", authTokenMiddleware, getContacts)
router.get("/messages/:roomId", authTokenMiddleware, getMessages)
router.post("/createRoom", authTokenMiddleware, createRoom)


module.exports = { router }