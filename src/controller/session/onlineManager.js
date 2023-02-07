const { v4: geneId } = require("uuid")


const onlineConnections = new Map()


const createNewConnection = (user) => {
    return {
        sessionId: geneId(),

        userId: user.id,
        username: user.name,
    }
}

const setNewconnection = (userId, sessionMap) => {
    onlineConnections.set(userId, sessionMap)
}

const getSession = (userId) => {
    return onlineConnections.get(userId)
}

const removeConnection = (userId) => {
    return onlineConnections.delete(userId)
}

module.exports = {
    createNewConnection,
    setNewconnection,
    getSession,
    removeConnection
}