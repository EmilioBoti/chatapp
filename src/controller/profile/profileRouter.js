const express = require("express")

const profileRouter = express.Router()

const multer = require("multer")
const upload = multer({ dest: "./assets" })

const { uploadProfileImage } = require("./profileLogic")
const { auth } = require("../chatBusiness/chatController")

profileRouter.post("/uploadImg", upload.single("file"), auth, uploadProfileImage)


module.exports = {
    profileRouter
}