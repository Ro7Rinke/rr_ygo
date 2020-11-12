const sqlite3 = require('sqlite3').verbose()
const logToFile = require('./common').logToFile
const errors = require('../data/system_info').errors
const paths = require('../data/system_info').paths
const Error = require('./class/Error')
const fs = require('fs')
const { resolve } = require('path')

const openDatabase = (path) => {
    let response = null

    let db = new sqlite3.Database(path, (error) => {
        if (error) {
            let date = Date.now()
            let code = 'db-1'
            let message = `${errors['db-1'].message} ${path}`
            let details = JSON.stringify(error)
            logToFile(new Error(code, message, details, date))
            response = new Error(code, message, details, date)
            return
        }
    })

    if (response == null)
        return db

    return response
}

const updateUserSpecific = (columns, values, id) => {
    return new Promise((resolve, reject) => {
        let db = openDatabase(paths.db_rr_ygo_3)

        if (db)
            if (db.is_error)
                reject(db)

        let sql = `UPDATE user SET `

        for (let index in columns) {
            sql += `${columns[index]} = (?)`
            if (index != columns.length - 1)
                sql += `, `
        }

        sql += ` WHERE id = (?)`

        let params = [...values, id]

        db.run(sql, params, (error) => {
            if (error) {
                let date = Date.now()
                let code = 'db-5'
                let message = `${errors['db-5'].message} on db ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                reject(new Error(code, message, details, date))
            }
            resolve()
        })
    })
}

const readUserSpecific = (columns, id) => {
    return new Promise((resolve, reject) => {
        let db = openDatabase(paths.db_rr_ygo_3)

        if (db)
            if (db.is_error)
                reject(db)

        let sql = `SELECT `
        let params = [id]

        for (let index in columns) {
            sql += `${columns[index]}`
            if (index != columns.length - 1)
                sql += `, `
        }

        sql += ` FROM user WHERE id = (?)`

        db.get(sql, params, (error, row) => {
            if (error) {
                let date = Date.now()
                let code = 'db-2'
                let message = `${errors['db-2'].message} of User ID "${id}" from ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                reject(new Error(code, message, details, date))
            }

            if (row) {
                resolve({ ...row, id })
            } else {
                let date = Date.now()
                let code = 'db-3'
                let message = `${errors['db-3'].message} User ID "${id}" from ${paths.db_rr_ygo_3}`
                let details = ''
                logToFile(new Error(code, message, details, date))
                reject(new Error(code, message, details, date))
            }
        })
    })
}

const readUserInfo = (id) => {
    return new Promise((resolve, reject) => {

        let db = openDatabase(paths.db_rr_ygo_3)

        if (db)
            if (db.is_error)
                reject(db)

        let sql = `SELECT nick, name, cash, rp, sealed_rp, unchecked_games, ranked_wins, ranked_defeats, ranked_draws, sealed_unchecked_games, sealed_wins, sealed_defeats, sealed_draws FROM user WHERE id = (?)`
        let params = [id]

        db.get(sql, params, (error, row) => {
            if (error) {
                let date = Date.now()
                let code = 'db-2'
                let message = `${errors['db-2'].message}, all infos of User ID "${id}" from ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                reject(new Error(code, message, details, date))
            }

            if (row) {
                resolve({ ...row, id })
            } else {
                let date = Date.now()
                let code = 'db-3'
                let message = `${errors['db-3'].message} User ID "${id}" from ${paths.db_rr_ygo_3}`
                let details = ''
                logToFile(new Error(code, message, details, date))
                reject(new Error(code, message, details, date))
            }
        })
    })
}

const createUserInfo = (user) => {
    return new Promise((resolve, reject) => {

        console.log(paths)
        let db = openDatabase(paths.db_rr_ygo_3)

        if (db)
            if (db.is_error)
                reject(db)

        let placeholder = '(?)'
        for (let i = 0; i < 13; i++)
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
            if (error) {
                let date = Date.now()
                let code = 'db-4'
                let message = `${errors['db-4'].message} ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                reject(new Error(code, message, details, date))
            }
            resolve()
        })

    })

}

const readUserId = (nick) => {
    return new Promise((resolve, reject) => {
        let db = openDatabase(paths.db_rr_ygo_3)

        if (db)
            if (db.is_error)
                reject(db)

        let sql = `SELECT id FROM user WHERE nick = (?)`
        let params = [nick]

        db.get(sql, params, (error, row) => {
            if (error) {
                let date = Date.now()
                let code = 'db-2'
                let message = `${errors['db-2'].message} ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                reject(new Error(code, message, details, date))
            }
            if (row) {
                resolve(row.id)
            } else {
                let date = Date.now()
                let code = 'db-3'
                let message = `${errors['db-3'].message} with nick: ${nick} ${paths.db_rr_ygo_3}`
                let details = ''
                let error = new Error(code, message, details, date)
                logToFile(error)
                reject(error)
            }
        })
    })
}

const readUserCards = (id) => {
    return new Promise((resolve, reject) => {
        let db = openDatabase(paths.db_rr_ygo_3)

        if (db)
            if (db.is_error)
                reject(db)

        let sql = `SELECT user_card.card_id, user_card.amount FROM user_card INNER JOIN user ON user.id = (?)`
        let params = [id]

        db.all(sql, params, (error, rows) => {
            if (error) {
                let date = Date.now()
                let code = 'db-2'
                let message = `${errors['db-2'].message} ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                logToFile(new Error(code, message, details, date))
                reject(new Error(code, message, details, date))
            }

            if (rows) {
                resolve(rows)
            } else {
                let date = Date.now()
                let code = 'db-3'
                let message = `${errors['db-3'].message} with id: ${id} ${paths.db_rr_ygo_3}`
                let details = ''
                let error = new Error(code, message, details, date)
                logToFile(error)
                reject(error)
            }
        })
    })
}

const readFile = (path) => {

    if (!fs.existsSync(path)) {
        let date = Date.now()
        let code = 'fs-1'
        let message = `${errors[code].message} path: ${path}`
        let details = ''
        let error_id = 'readFile'
        let error = new Error(code, message, details, date, error_id)
        logToFile(error)
        return error
    }

    let data = fs.readFileSync(path, {encoding: 'utf-8'})

    if (data) {
        return data
    } else {
        let date = Date.now()
        let code = 'fs-2'
        let message = `${errors[code].message} path: ${path}`
        let details = ''
        let error_id = 'readFile'
        let error = new Error(code, message, details, date, error_id)
        logToFile(error)
        return error
    }
}

const readDir = (path) => {

    if (!fs.existsSync(path)) {
        let date = Date.now()
        let code = 'fs-1'
        let message = `${errors[code].message} path: ${path}`
        let details = ''
        let error = new Error(code, message, details, date)
        logToFile(error)
        return error
    }

    let data = fs.readdirSync(path, {encoding: 'utf-8'})

    if (data) {
        return data
    } else {
        let date = Date.now()
        let code = 'fs-2'
        let message = `${errors[code].message} path: ${path}`
        let details = ''
        let error = new Error(code, message, details, date)
        logToFile(error)
        return error
    }
}

const writeFile = (path, data) => {
    if (!fs.existsSync(path)) {
        let date = Date.now()
        let code = 'fs-1'
        let message = `${errors[code].message} path: ${path}`
        let details = ''
        let id = 'writeFile'
        let error = new Error(code, message, details, date, id)
        logToFile(error)
        return error
    }

    fs.writeFileSync(path, data, {encoding: 'utf-8'})
}

const deleteFile = (path) => {

    if (!fs.existsSync(path)) {
        let date = Date.now()
        let code = 'fs-1'
        let message = `${errors[code].message} path: ${path}`
        let details = ''
        let error = new Error(code, message, details, date)
        logToFile(error)
        return error
    }

    fs.unlinkSync(path)
}

const createCard = (card) => {
    return new Promise((resolve, reject) => {
        let db = openDatabase(paths.db_rr_ygo_3)

        if (db)
            if (db.is_error)
                reject(db)

        let sql = `INSERT INTO card(id, ygo_id) VALUES (?,?)`
        let params = [card.id, card.ygo_id]

        db.run(sql, params, (error) => {
            if (error) {
                let date = Date.now()
                let code = 'db-4'
                let message = `${errors['db-4'].message} ${paths.db_rr_ygo_3}`
                let details = JSON.stringify(error)
                let error_id = 'createCard'
                logToFile(new Error(code, message, details, date, error_id))
                reject(new Error(code, message, details, date, error_id))
            }
            resolve()
        })
    })
}

module.exports = {
    readUserInfo,
    createUserInfo,
    readUserSpecific,
    updateUserSpecific,
    readUserId,
    readUserCards,
    readFile,
    readDir,
    createCard,
    deleteFile,
    writeFile,
}