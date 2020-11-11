const readUserId = require('./db').readUserId
const readUserSpecific = require('./db').readUserSpecific
const Error = require('./class/Error')
const errors = require('../data/system_info').errors
const logToFile = require('./common').logToFile
const readUserInfo = require('./db').readUserInfo
const readUserCards = require('./db').readUserCards

const login = async (nick, password) => {
    let user = { nick }

    try{
        user.id = await readUserId(user.nick)
    }catch (error){
        throw error
    }

    let correct_password

    try{
        let data = await readUserSpecific(['password'], user.id)
        correct_password = data.password
    }catch(error){
        throw error
    }

    if (password === correct_password) {
        
        try{
            let data = await readUserInfo(user.id)
            user = {...user, ...data}
        }catch(error){
            throw error
        }

        try{
            user.cards = await readUserCards(user.id)
        }catch(error){
            throw error
        }

        return user

    } else {
        let date = Date.now()
        let code = 'us-1'
        let message = `${errors[code].message}`
        let details = ''
        let error = new Error(code, message, details, date)
        logToFile(error)
        throw error
    }
}

module.exports = { login }