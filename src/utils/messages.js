
const generateMessage = (text, userName) => {
    return {
        text,
        userName,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (locLink, userName) => {
    return {
        locLink,
        userName,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}