const express = require("express")
const router = express.Router()

const chat = require("./chatLogic")


router.get("/chat/:user", chat.findUser)
router.get("/contacts/:id", chat.getContacts)
router.get("/messages/:roomId", chat.getMessages)
router.post("/createRoom", chat.createRoom)
router.post("/friendRequest", chat.acceptFriendRequest)


module.exports = { router }