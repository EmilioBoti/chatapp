require("dotenv").config()

const express = require('express')
const app = express()
const { updateSocket } = require("./controller/auth/auth")
const { Server } = require("socket.io")

const { v4: geneId } = require("uuid")

const { router } = require('./controller/auth/routers/authRouter')
const chatRouter = require('./controller/chatBusiness/chatRouter')
const { insertMessage } = require('./controller/chatBusiness/chatLogic')
const { friendRequest } = require("./controller/users/searchLogic")
const searchRouter = require("./controller/users/searchRounter")
const notificationRouter = require("./controller/notification/notification.router")

const { PRIVATE_SMS, NOTIFICATION, USER_CONNECTION, parseToJson } = require("./controller/utils/const")

const port = 3000

app.set('port', process.env.PORT || port)
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/api', router)
app.use('/api', chatRouter.router)
app.use('/api', searchRouter)
app.use('/api', notificationRouter.router)


const server = app.listen(app.get("port"), () => {
    console.log(`Listennig in por ${app.get("port")}`)
})

const io = new Server(server)

io.on("connection", (socket) => {
    socket.on(USER_CONNECTION, (data) => {
        const user = parseToJson(data)
        updateSocket(user.id, user.socketId)
    }) 

    socket.on(PRIVATE_SMS, (package) => {
        const data = parseToJson(package)
        insertMessage(data, io)
    })

    socket.on(NOTIFICATION, (data) => {
        const package = parseToJson(data)
        const user = {
            id: geneId(),
            ...package,
            accepted: false
        }
        friendRequest(user, io)
    })
    
    socket.on("disconnect", (reason) => {
        
    })
    
})

module.exports = { server, io }