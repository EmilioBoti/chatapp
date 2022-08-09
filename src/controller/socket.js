const socket = require("socket.io")
const { io } = require("../index")


io.on("connection", (socket)=>{
    console.log(socket.id)
})

