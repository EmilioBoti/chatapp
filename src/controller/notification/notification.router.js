const express = require("express")
const router = express.Router()

const notificationLogic = require("./notification.logic")

router.post("/acceptNotification", notificationLogic.acceptFriendRequest)
router.post("/rejectNotification", notificationLogic.rejectFriendRequest)


module.exports = { router }