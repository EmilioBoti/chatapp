const updateImageQuery = `
    UPDATE register_user
    SET public_id = ?,
    image_url = ?
    WHERE id = ?
`

module.exports = {
    updateImageQuery
}