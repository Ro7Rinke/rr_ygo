const readFile = require('./db').readFile
const paths = require('../data/system_info').paths
const logToFile = require('./common').logToFile
const errors = require('../data/system_info').errors
const createCard = require('./db').createCard
const readDir = require('./db').readDir
const deleteFile = require('./db').deleteFile
const writeFile = require('./db').writeFile
const Error = require('./class/Error')

const importCards = async () => {
    let data = readFile(paths.import_cards_config)

    if (data)
        if (data.is_error)
            return null

    let cards = JSON.parse(data)

    if (!Array.isArray(cards)) {
        let date = Date.now()
        let code = 'sy-1'
        let message = `${errors[code].message}`
        let details = ''
        let error_id = 'importCards'
        let error = new Error(code, message, details, date, error_id)
        logToFile(error)
        return null
    }

    for (let index in cards) {
        try {
            await createCard(cards[index])
        } catch (e) {
            // let date = Date.now()
            // let code = 'db-4'
            // let message = `${errors[code].message} card`
            // let details = JSON.stringify(cards[index])
            // let error_id = 'importCards'
            // let error = new Error(code, message, details, date, error_id)
            // logToFile(error)
        }
    }
}

const importCardsFromDecks = async () => {
    let decks_names = readDir(paths.import_cards_decks_dir)

    if (decks_names)
        if (decks_names.is_error)
            return null

    let cards = {}
    let regexp = new RegExp(/^[0-9]+$/gm)

    for (let deck_name of decks_names) {
        let data = readFile(`${paths.import_cards_decks_dir}/${deck_name}`)

        if (data){
            if (data.is_error) {
                let date = Date.now()
                let code = 'fs-2'
                let message = `${errors[code].message} deck`
                let details = `${paths.import_cards_decks_dir}/${deck_name}`
                let error = new Error(code, message, details, date)
                logToFile(error)
            } else {
                let rows = data.split('\n')

                if (Array.isArray(rows)) {

                    for (let row of rows) {
                        if (row[0] != '#' && row[0] != '!') {
                            let match_id = row.match(regexp)
                            if(match_id && match_id[0])
                                cards[`${match_id[0]}`] = {
                                    id: match_id[0],
                                    ygo_id: match_id[0]
                                }
                        }
                    }
                    deleteFile(`${paths.import_cards_decks_dir}/${deck_name}`)

                } else {
                    let date = Date.now()
                    let code = 'sy-1'
                    let message = `${errors[code].message} split`
                    let details = data
                    let error = new Error(code, message, details, date)
                    logToFile(error)
                }
            }
        }
    }

    let config = []
    for (let index in cards) {
        config.push(cards[index])
    }

    writeFile(paths.import_cards_config, JSON.stringify(config))

    await importCards()
}

module.exports = {
    importCards,
    importCardsFromDecks,
}