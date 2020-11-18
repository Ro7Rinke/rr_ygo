const Error = require('./class/Error')
const { game_type_codes } = require('../data/system_info')
const { game_stat_codes } = require('../data/system_info')
const { game_type_names } = require('../data/system_info')
const { game_stat_names } = require('../data/system_info')
const { paths } = require('../data/system_info')
const { general_info } = require('../data/system_info')
const { writeFile } = require('./db')
const { updateUserAdd } = require('./db')

const extractGameType = (name) => {
    let name_array = name.split('.')

    if (!Array.isArray(name_array)) {
        let date = Date.now()
        let code = 'sy-1'
        let message = `${errors[code].message} split`
        let details = `string: ${name}`
        let error_id = 'extractGameType'
        let error = new Error(code, message, details, date, error_id)
        logToFile(error)
        return error
    }

    let codes = name_array.slice(19)

    if (typeof codes != 'string') {
        let date = Date.now()
        let code = 'sy-1'
        let message = `${errors[code].message} slice`
        let details = `string: ${name}`
        let error_id = 'extractGameType'
        let error = new Error(code, message, details, date, error_id)
        logToFile(error)
        return error
    }

    let codes_array = codes.split('')

    if (!Array.isArray(codes_array)) {
        let date = Date.now()
        let code = 'sy-1'
        let message = `${errors[code].message} split`
        let details = `string: ${codes}`
        let error_id = 'extractGameType'
        let error = new Error(code, message, details, date, error_id)
        logToFile(error)
        return error
    }

    let tags = {}

    for (let code of codes_array) {
        if (game_type_codes[code]) {
            tags.type = code
        } else if (game_stat_codes[code]) {
            tags.stat = code
        }
    }

    return tags

}

const addGame = async (id, game) => {
    // game = {
    //     name: '2020-10-09 06-15-41w.yrpX',
    //     data: 'base64' 
    // }

    let tags = extractGameType(game.name)

    if (tags && tags.is_error)
        return error

    let path = `${paths.users_dir}/${id}/replays`
    let value = 0
    let game_type_column = ''

    if (tags.code) {
        switch (tags.code) {
            case game_type_names.sealed:
                path = `${path}/sealedUnchecked`
                value = general_info.sealed_unchecked_game_value
                game_type_column = 'sealed_unchecked_games'
                break
            case game_type_names.ranked:
                path = `${path}/rankedUnchecked`
                value = general_info.ranked_unchecked_game_value
                game_type_column = 'ranked_unchecked_games'
                break
        }
        if (tags.stat) {
            switch (tags.stat) {
                case game_stat_names.win:
                    path = `${path}/possibleWin`
                    break
                case game_stat_names.defeat:
                    path = `${path}/possibleDefeat`
                    break
                case game_stat_names.draw:
                    path = `${path}/possibleDraw`
                    break
            }
        } else {
            path = `${path}/unmarked`
        }
    } else {
        path = `${path}/others`
    }

    path = `${path}/${game.name}`

    let response = writeFile(path, game.data)

    if (response && response.is_error)
        return error

    if (game_type_column != '')
        try {
            await updateUserAdd(game_type_column, 1)
        } catch (error) {
            return error
        }

    try {
        await updateUserAdd('cash', value, id)
    } catch (error) {
        return error
    }
}

module.exports = {
    addGame,
}