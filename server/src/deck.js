const { deleteFile } = require('./db')
const { starting_cards } = require('../data/system_info')
const { new_player_info } = require('../data/system_info')
const { between } = require('./common')
const { paths } = require('../data/system_info')
const { readDir } = require('./db')
const { readFile } = require('./db')
const { writeFile } = require('./db')
const { readFileInfo } = require('./db')

const generateStartingDeck = () => {
    let starting_deck = "#created by RR_YGO_3 rnd deck\n#main"
    let local_starting_cards = [...starting_cards]
    for (let type in new_player_info.starting_deck_info) {
        for (let index = 0; index < new_player_info.starting_deck_info[type]; index++) {
            const card_index = between(0, local_starting_cards[type].length - 1)
            starting_deck = `${starting_deck}\n${local_starting_cards[type].splice(card_index, 1)}`
        }
    }
    return starting_deck = `${starting_deck}\n#extra\n!side\n`
}

const getUserDecks = (id) => {
    return readDir(`${paths.users_dir}/${id}/decks`)
}

const getUserDecksInfo = (id) => {
    let decks_names = getUserDecks(id)

    if (decks_names)
        if (decks_names.is_error)
            return decks_names
    let decks_infos = []
    for (let deck_name of decks_names) {
        let info = readFileInfo(`${paths.users_dir}/${id}/decks/${deck_name}`)
        if (info) {
            if (!info.is_error) {
                decks_infos.push(info)
            }
        }
    }

    return decks_infos
}

const readUserDeck = (id, deck_name) => {
    return readFile(`${paths.users_dir}/${id}/decks/${deck_name}`)
}

const createUserDeck = (id, deck_name, deck_data) => {
    return writeFile(`${paths.users_dir}/${id}/decks/${deck_name}`, deck_data)
}

const deleteUserDeck = (id, deck_name) => {
    return deleteFile(`${paths.users_dir}/${id}/decks/${deck_name}`)
}

module.exports = {
    generateStartingDeck,
    getUserDecks,
    readUserDeck,
    createUserDeck,
    getUserDecksInfo,
    deleteUserDeck,
}