const loginQuery = `
    SELECT id, name, email, pw, socket_id 
    FROM register_user WHERE email = ?
`

const updateSocketQuery = `UPDATE register_user SET socket_id = ? WHERE id = ?`

const insertUserQuery = `INSERT INTO register_user (id, name , email, pw, date_created)
    values(?, ?, ?, ?, CURRENT_TIMESTAMP)
    `

module.exports = {
    loginQuery,
    updateSocketQuery,
    insertUserQuery
}