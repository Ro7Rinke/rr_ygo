const  readFile  = require('./db').readFile
const  paths  = require('../data/system_info').paths
const  logToFile  = require('./common').logToFile
const  errors  = require('../data/system_info').errors
const  createCard  = require('./db').createCard
const  readDir  = require('./db').readDir
const  deleteFile  = require('./db').deleteFile
const  writeFile  = require('./db').writeFile
const Error = require('./class/Error')
const  updateUserAdd  = require('./db').updateUserAdd
const  readUserCards  = require('./db').readUserCards
const  updateUserCard  = require('./db').updateUserCard
const  createUserCard  = require('./db').createUserCard
const  toArray  = require('./common').toArray

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

    let config = toArray(readCardsFromDecks(paths.import_cards_decks_dir))

    writeFile(paths.import_cards_config, JSON.stringify(config))

    await importCards()
}

const readCardsFromDecks = (dir) => {
    let decks_names = readDir(dir)

    if (decks_names)
        if (decks_names.is_error)
            return decks_names

    let cards = {}
    let regexp = new RegExp(/^[0-9]+$/gm)

    for (let deck_name of decks_names) {
        if(deck_name.match(new RegExp(/.ydk$/))){
            let data = readFile(`${dir}/${deck_name}`)

            if (data) {
                if (data.is_error) {
                    let date = Date.now()
                    let code = 'fs-2'
                    let message = `${errors[code].message} deck`
                    let details = `${dir}/${deck_name}`
                    let error = new Error(code, message, details, date)
                    logToFile(error)
                } else {
                    let rows = data.split('\n')

                    if (Array.isArray(rows)) {

                        for (let row of rows) {
                            if (row[0] != '#' && row[0] != '!') {
                                let match_id = row.match(regexp)
                                if (match_id && match_id[0])
                                    cards[`${match_id[0]}`] = {
                                        id: match_id[0],
                                        ygo_id: match_id[0]
                                    }
                            }
                        }
                        deleteFile(`${dir}/${deck_name}`)

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
    }

    return cards
}

const addCardsWithJunk = async (cards, user_id) => {

    // cards = {
    //     card_id,
    //     amount,
    //     junk_value,
    //     rarity
    // }

    let user_cards = {}

    try {
        let user_cards_array = await readUserCards(user_id)
        for (item of user_cards_array) {
            user_cards[item.card_id] = item
        }
    } catch (error) {
        throw error
    }

    let result = {
        update: [],
        new: [],
        junk: []
    }

    for (let card of cards) {
        if (user_cards[card.card_id]) {
            let junk_amount = 0
            if (user_cards[card.card_id].amount < 3) {
                junk_amount = (user_cards[card.card_id].amount + card.amount) - 3
                if (junk_amount > 0) {
                    card.amount -= junk_amount
                }

                let new_amount = user_cards[card.card_id].amount + card.amount
                try {
                    await updateUserCard(card.card_id, new_amount, user_id)
                } catch (error) {
                    throw (error)
                }

                result.update.push(card)
            } else {
                junk_amount = card.amount
            }

            if (junk_amount > 0) {
                try {
                    await updateUserAdd('cash', junk_amount * card.junk_value, user_id)
                } catch (error) {
                    throw (error)
                }

                result.junk.push({ ...card, amount: junk_amount })
            }
        } else {
            if (card.amount > 3) {
                let junk_amount = card.amount - 3
                card.amount -= junk_amount

                result.junk.push({ ...card, amount: junk_amount })

                try {
                    await updateUserAdd('cash', junk_amount * card.junk_value, user_id)
                } catch (error) {
                    throw (error)
                }
            }

            try {
                await createUserCard(user_id, card.card_id, card.amount)
            } catch (error) {
                throw (error)
            }

            result.new.push(card)
        }
    }

    return result
}

module.exports = {
    importCards,
    importCardsFromDecks,
    addCardsWithJunk,
    readCardsFromDecks
}