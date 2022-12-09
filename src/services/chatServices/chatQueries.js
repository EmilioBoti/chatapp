const queryUserContacts = `SELECT userroom.roomId, register_user.id,
    register_user.socket_id as socketId, register_user.name,
    register_user.email,
    (SELECT message.date_created
        FROM message 
        WHERE message.room_id = userroom.roomId
        ORDER BY message.date_created DESC
        LIMIT 1) as times, 
    (SELECT message.smsHash
        FROM message 
        WHERE message.room_id = userroom.roomId
        ORDER BY message.date_created DESC
        LIMIT 1) as smsHash,
    (SELECT message.message
    FROM message 
    WHERE message.room_id = userroom.roomId
    ORDER BY message.date_created DESC
    LIMIT 1) as lastMessage,
    users.id as toUser
    FROM userroom
    INNER JOIN register_user
    ON register_user.id = userroom.userId
    INNER JOIN register_user as users
    ON users.id = userroom.otherUserId
    LEFT JOIN message 
    ON message.to_u_id = users.id
    WHERE users.id = ?
    GROUP BY register_user.email
`

const queryGetMessages = `SELECT message.room_id as roomId,
    message.id as messageId, message.from_u_id as fromU,
    message.to_u_id as toU, register_user.name as userName,
    message.message, timestamp(message.date_created) as times, smsHash
    FROM message
    INNER JOIN register_user 
    ON register_user.id = message.from_u_id
    WHERE room_id = ?
    ORDER BY times
`
const queryFindUser = `SELECT id, name, email, socket_id as socketId 
    FROM register_user 
    WHERE name LIKE ?
`

const queryInsertSms = `INSERT INTO message (id, from_u_id, to_u_id, message, date_created, room_id, smsHash)
    VALUES (?,?,?,?,CURRENT_TIMESTAMP,?,?)
`

const querySingleUser = `SELECT socket_id as socket FROM register_user
    WHERE id = ?
`

module.exports = {
    queryUserContacts,
    queryGetMessages,
    queryFindUser,
    queryInsertSms,
    querySingleUser
}