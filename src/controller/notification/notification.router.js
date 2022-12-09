const express = require("express")
const { auth } = require("../chatBusiness/chatController")
const router = express.Router()

const notificationLogic = require("./notification.logic")

router.post("/acceptNotification", auth , notificationLogic.acceptFriendRequest)
router.post("/rejectNotification", auth, notificationLogic.rejectFriendRequest)
router.get("/notifications/:id", auth, notificationLogic.getNotifications)


module.exports = { router }