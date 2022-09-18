require("dotenv").config()

const express = require('express')
const app = express()
const { updateSocket } = require("./controller/auth/auth")
const { Server } = require("socket.io")

const { v4: geneId } = require("uuid")

const { router } = require('./routers/authRouter')
const chatRouter = require('./controller/chatBusiness/chatRouter')
const { insertMessage } = require('./controller/chatBusiness/chatLogic')

const { eventsEmitter  } = require("./controller/users/searchLogic")
const { chatEventsEmitter  } = require("./controller/chatBusiness/chatLogic")


const port = 3000

app.set('port', process.env.PORT || port)
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/api', router)
app.use('/api', chatRouter.router)


const server = app.listen(app.get("port"), () => {
    console.log(`Listennig in por ${app.get("port")}`)
})

const io = new Server(server)

io.on("connection", (socket) => {
    
    socket.on("user", (data) => {
        const user = JSON.parse(data)
        updateSocket(user.id, user.socketId)
    }) 

    socket.on("private", (package) => {
        const data = JSON.parse(package)
        insertMessage(data, io)
    })

    
    socket.on("notification", (data) => {
        const package = JSON.parse(data)
        const user = {
            id: geneId(),
            ...package,
            accepted: false
        }
        io.to(user.toSocketId).emit("notify", user)
    })
    
    socket.on("disconnect", (reason) => {
        
    })
    
})

module.exports = { server, io }