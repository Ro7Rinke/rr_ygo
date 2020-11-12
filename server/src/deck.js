const starting_cards = require('../data/system_info').starting_cards
const new_player_info = require('../data/system_info').new_player_info
const between = require('./common').between
const paths = require('../data/system_info').paths
const readDir = require('./db').readDir
const readFile = require('./db').readFile

const generateStartingDeck = () => {
    let starting_deck = "#created by RR_YGO_3 rnd deck\n#main"
    let local_starting_cards = [...starting_cards]
    for (let type in new_player_info.starting_deck_info){
        for(let index = 0; index < new_player_info.starting_deck_info[type]; index++){
            const card_index = between(0, local_starting_cards[type].length - 1)
            starting_deck = `${starting_deck}\n${local_starting_cards[type].splice(card_index, 1)}`
        }
    }
    return starting_deck = `${starting_deck}\n#extra\n!side\n`
}

const getUserDecks = (id) => {
    return readDir(`${paths.users_dir}/${id}/decks`)
}

const readUserDeck = (id, deck_name) => {
    return readFile(`${paths.users_dir}/${id}/decks/${deck_name}`)
}

module.exports = {
    generateStartingDeck,
    getUserDecks,
    readUserDeck,
}