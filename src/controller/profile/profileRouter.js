const express = require("express")

const profileRouter = express.Router()

const multer = require("multer")
const upload = multer({ dest: "./assets" })

const { uploadProfileImage } = require("./profileLogic")
const { authTokenMiddleware } = require("../auth/middleware/authMiddleware")

profileRouter.post("/uploadImg", upload.single("file"), authTokenMiddleware, uploadProfileImage)


module.exports = {
    profileRouter
}