const removeBearerToken = token => {
    if (token.includes("Bearer ")) token = token.slice(7)
    return token
}

module.exports = {
    removeBearerToken
}