const express = require("express")
const searchRouter = express.Router()

const searchLogic = require("../users/searchLogic")

searchRouter.post("/request", searchLogic.friendRequest)
// searchRouter.get("/notifications/:id", searchLogic.getNotifications)


module.exports = searchRouter