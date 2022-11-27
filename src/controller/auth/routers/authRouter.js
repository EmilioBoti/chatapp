const express = require('express')
const router = express.Router()
const authController = require('../auth')


router.post("/login" , authController.login)
router.post("/signin" , authController.register)


module.exports = {
    router
}