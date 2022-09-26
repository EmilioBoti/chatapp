const NOTIFY = "notify"
const NOTIFICATION = "notification"
const PRIVATE_SMS = "private"
const USER_CONNECTION = "user"


const parseToJson = (package) => JSON.parse(package)


module.exports = {
    NOTIFICATION,
    NOTIFY,
    PRIVATE_SMS,
    USER_CONNECTION,
    parseToJson
}