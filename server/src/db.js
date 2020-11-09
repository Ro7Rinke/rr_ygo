const sqlite3 = require('sqlite3').verbose()
const logToFile = require('./common').logToFile
const errors = require('../data/system_info').errors
const paths = require('../data/system_info').paths
const Error = require('./class/Error')

const openDatabase = (path) => {
    let response = null

    let db = new sqlite3.Database(path, (error) => {
        if(error){
            let date = Date.now()
            let code = 'db-1'
            let message = `${errors['db-1'].message} ${path}`
            let details = JSON.stringify(error)
            logToFile(new Error(code, message, details, date))
            response = error
            return
        }
    })

    if(response == null)
        return db

    return response
}

const readUserSpecific = (columns, id) => {
    return new Promise((resolve, reject) => {
        let db = openDatabase(paths.db_rr_ygo_3)

        if(db.is_error)
            reject(db)

        let sql = `SELECT `
        let params = [id]

        for(let index in columns){
            sql += `${columns[index]}`
            if(index != columns-1)
                sql += `, `
        }

        sql += ` FROM user WHERE id = (?)`

        db.get(sql, params, (error, row) => {
            if(error){
                let date = Date.now()
                let code = 'db-2'
                let message = `${errors['db-2'].message} of User ID "${id}" from ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                reject(error)
            }

            if(row){
                resolve({...row, id})
            }else{
                let date = Date.now()
                let code = 'db-3'
                let message = `${errors['db-3'].message} User ID "${id}" from ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                reject(error)
            }
        })
    })
}

const readUserInfo = (id) => {
    return new Promise((resolve, reject) => {

        let db = openDatabase(paths.db_rr_ygo_3)

        let sql = `SELECT nick, name, cash, rp, sealed_rp, unchecked_games, ranked_wins, ranked_defeats, ranked_draws, sealed_unchecked_games, sealed_wins, sealed_defeats, sealed_draws FROM user WHERE id = (?)`
        let params = [id]

        db.get(sql, params, (error, row) => {
            if(error){
                let date = Date.now()
                let code = 'db-2'
                let message = `${errors['db-2'].message}, all infos of User ID "${id}" from ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                reject(error)
            }

            if(row){
                resolve({...row, id})
            }else{
                let date = Date.now()
                let code = 'db-3'
                let message = `${errors['db-3'].message} User ID "${id}" from ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                reject(error)
            }
        })
    })
}

const createUserInfo = (user) => {
    return new Promise((resolve, reject) => {

        console.log(paths)
        let db = openDatabase(paths.db_rr_ygo_3)

        let placeholder = '(?)'
        for(let i = 0; i < 13; i++)
            placeholder += ',(?)'

        let sql = `INSERT INTO user(id, password, nick, cash, rp, sealed_rp, unchecked_games, ranked_wins, ranked_defeats, ranked_draws, sealed_unchecked_games, sealed_wins, sealed_defeats, sealed_draws) VALUES (${placeholder})`
        let params = [
                user.id,
                user.password,
                user.nick,
                user.cash,
                user.rp,
                user.sealed_rp,
                user.unchecked_games,
                user.ranked_wins,
                user.ranked_defeats,
                user.ranked_draws,
                user.sealed_unchecked_games,
                user.sealed_wins,
                user.sealed_defeats,
                user.sealed_draws
        ]

        db.run(sql, params, (error) => {
            if(error){
                let date = Date.now()
                let code = 'db-4'
                let message = `${errors['db-4'].message} ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                console.log(error)
                reject(error)
            }
            console.log('ok')
            resolve()
        })

    })
    
}

module.exports = {readUserInfo, createUserInfo, readUserSpecific}