const nodemailer = require("nodemailer")
const nodemailerSendGrid = require("nodemailer-sendgrid")
const templete = require("./tempplete/templete")

const createTransport = () => {
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "a25d98333369a6",
          pass: "9cbfb1c090cc34"
        }
      })
      
      return transport
}

const sendingMail = async (newUser) => {

    let transport = createTransport()
    
    let info = await transport.sendMail({
        from: "Ebot Chat <ebotchat@gmail.com>",
        to: newUser.email,
        subject: `Welcome to Ebot Chat!! ${newUser.name}`,
        html: templete
    })

    console.log(info.response)
    return
}


module.exports = {
    sendingMail
}

