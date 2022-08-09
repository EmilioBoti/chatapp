const express = require("express")
const router = express.Router()

const chat = require("./chatLogic")


router.get("/chat/:user", chat.findUser)
router.get("/contacts/:id", chat.getContacts)
router.post("/createRoom", chat.createRoom)


module.exports = { router }