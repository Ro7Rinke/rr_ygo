const {
    readUserCards,
    readFile,
} = require('./db')
const {
    paths,
} = require('../data/system_info')

const generateUserCardsList = async (user_id) => {
    let user_cards
    try {
        user_cards = await readUserCards(user_id)
    } catch (error) {
        throw error
    }

    user_cards.sort((card_a, card_b) => {
        if(card_a.amount > card_b.amount)
            return 1
        
        return -1
    })

    let lflist_str = `#[Your Cards]\n!Your Cards\n$whitelist\n`

    for(let card of user_cards){
        lflist_str = `${lflist_str}${card.card_id} ${card.amount}\n`
    }

    return lflist_str
}

const getDefaultList = () => {
    return readFile(paths.default_lflist)
}

const getList = async (user_id) => {
    let lflist_user_cards
    try {
        lflist_user_cards = await generateUserCardsList(user_id)
    } catch (error) {
        throw error
    }

    let default_lflist = getDefaultList()

    if(default_lflist && default_lflist.is_error)
        throw default_lflist

    return `${lflist_user_cards}${default_lflist}`
}

module.exports = {
    generateUserCardsList,
    getDefaultList,
    getList,
}