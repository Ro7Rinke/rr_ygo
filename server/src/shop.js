const {
    getCollectionInfo,
    generateCardsFromPack,
} = require('./collection')
const {
    readUserSpecific,
    updateUserAdd,
} = require('./db')
const Error = require('./class/Error')
const {
    logToFile,
} = require('./common')
const {
    errors,
} = require('../data/system_info')
const {
    addCardsWithJunk,
} = require('./card')

const buyPack = async (collection_id, user_id) => {
    let collection_info
    try {
        collection_info = await getCollectionInfo(collection_id)
    } catch (error) {
        throw error
    }

    let user_cash

    try {
        user_cash = await readUserSpecific(['cash', user_id])
    } catch (error) {
        throw error
    }

    if (user_cash < collection_info.price) {
        let date = Date.now()
        let code = 'sh-1'
        let message = `${errors[code].message}`
        let details = `user cash: ${user_cash}, pack price: ${collection_info.price}`
        let error_id = 'buyPack'
        let error = new Error(code, message, details, date, error_id)
        logToFile(error)
        throw error
    }

    try {
        await updateUserAdd('cash', -collection_info.price, user_id)
    } catch (error) {
        throw error
    }

    let new_cards

    try {
        new_cards = await generateCardsFromPack(collection_id)
    } catch (error) {
        throw error
    }

    let cards_added

    try {
        cards_added = await addCardsWithJunk(new_cards, user_id)
    } catch (error) {
        throw error
    }

    return cards_added

}

module.exports = {
    buyPack,
}