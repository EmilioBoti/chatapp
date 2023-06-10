require("dotenv").config()

const express = require('express')
const app = express()
const { updateSocket } = require("./controller/auth/auth")
const { Server } = require("socket.io")
const cors = require('cors');

const { v4: geneId } = require("uuid")
const jwt = require("jsonwebtoken")
const { removeBearerToken } = require("./controller/utils/helpers")
const { createNewConnection, getSession, setNewconnection } = require("./controller/session/onlineManager")

const { router } = require('./controller/auth/routers/authRouter')
const chatRouter = require('./controller/chatBusiness/chatRouter')
const { insertMessage } = require('./controller/chatBusiness/chatController')
const { friendRequest } = require("./controller/users/searchLogic")
const searchRouter = require("./controller/users/searchRounter")
const notificationRouter = require("./controller/notification/notification.router")
const { profileRouter } = require("./controller/profile/profileRouter")

const { PRIVATE_SMS, NOTIFICATION, USER_CONNECTION, parseToJson } = require("./controller/utils/const")

const port = 3000

app.set('port', process.env.PORT || port)
app.use(cors({ origin: true }));
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/api', router)
app.use('/api', profileRouter)
app.use('/api', chatRouter.router)
app.use('/api', searchRouter)
app.use('/api', notificationRouter.router)


const server = app.listen(app.get("port"), () => {
    console.log(`Listennig in por ${app.get("port")}`)
})

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.use((socket, next) => {
    const creden = socket.handshake.auth
    const data = creden.token

    const user = jwt.verify(removeBearerToken(data), process.env.JWTKEY)
    const session = getSession(user.id)

    if (session) {
        socket.session = session
        return next()
    }

    const newSession = createNewConnection(user)
    setNewconnection(user.id, newSession)
    socket.session = newSession

    next()
})

io.on("connection", (socket) => {

    socket.join(socket.session.userId)

    socket.on(PRIVATE_SMS, (package) => {
        const data = parseToJson(package)
        insertMessage(data, (isInserted, message) => {
            if (isInserted) {
                io.to(data.toU).to(socket.session.userId).emit("message", message)
            }
        })
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