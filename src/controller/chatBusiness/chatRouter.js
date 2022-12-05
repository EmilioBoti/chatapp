const express = require("express")
const router = express.Router()

const { findUser, getContacts, getMessages, createRoom, auth } = require("./chatController")

router.get("/chat/:user", auth, findUser)
router.get("/contacts", auth, getContacts)
router.get("/messages/:roomId", auth, getMessages)
router.post("/createRoom", auth, createRoom)


module.exports = { router }