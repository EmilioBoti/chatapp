const express = require("express")
const { authTokenMiddleware } = require("../auth/middleware/authMiddleware")
const router = express.Router()

const notificationLogic = require("./notification.logic")

router.post("/acceptNotification", authTokenMiddleware, notificationLogic.acceptFriendRequest)
router.post("/rejectNotification", authTokenMiddleware, notificationLogic.rejectFriendRequest)
router.get("/notifications", authTokenMiddleware, notificationLogic.getNotifications)


module.exports = { router }