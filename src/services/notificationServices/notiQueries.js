const notificationQuery = `SELECT notificationstack.id as notificationId, notificationstack.fromU as fromU,
    notificationstack.toU as toU,
    users.name, users.socket_id as socketId, users.email,
    notificationstack.dateCreated,
    notificationstack.accepted as state
    FROM notificationstack
    INNER JOIN register_user
    ON register_user.id = notificationstack.toU
    INNER JOIN register_user as users 
    ON users.id = notificationstack.fromU
    WHERE (notificationstack.toU = ?)
    LIMIT 15
`
module.exports = {
    notificationQuery
}