const express = require('express')
const router = express.Router()
const authController = require('../auth')


router.post("/login" , authController.login)
router.post("/signup" , authController.signUpUser)


module.exports = {
    router
}