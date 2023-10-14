const express = require("express")
const searchRouter = express.Router()

const searchLogic = require("../users/searchLogic")
const { authTokenMiddleware } = require("../auth/middleware/authMiddleware")

searchRouter.post("/request", authTokenMiddleware, searchLogic.friendRequest)

module.exports = searchRouter