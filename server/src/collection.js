const {
    readCollection,
    readCollectionCards,
    readCollectionSlots,
    createCollection,
    createCollectionCard,
    createCollectionSlot,
    createSlotRarityChance,
    writeFile,
    readFile,
    readDir,
    readSlotRaritiesChances,
} = require('./db')
const paths = require('../data/system_info').paths
const readCardsFromDecks = require('./card').readCardsFromDecks

const importCollections = async () => {
    let data = readFile(paths.import_collections_config)

    if(data && data.is_error)
        throw data
    
    let collections = JSON.parse(data)

    if(!Array.isArray(collections)){
        let date = Date.now()
        let code = 'sy-1'
        let message = `${errors[code].message}`
        let details = ''
        let error_id = 'importCollections'
        let error = new Error(code, message, details, date, error_id)
        logToFile(error)
        throw error
    }

    for(let collection of collections){
        try {
            await createCollection({
                id: collection.id, 
                name: collection.name, 
                total_cards: collection.total_cards, 
                price: collection.price, 
                cards_per_pack: collection.cards_per_pack, 
                pack_limit: collection.pack_limit, 
                description: collection.description
            })
        } catch (error) {
            throw error
        }

        for( let collection_card of collection.cards){
            try {
                await createCollectionCard(collection_card, collection.id)
            } catch (error) {
                throw error
            }
        }

        for (let slot of collection.slots){

            let slot_id
            try {
                slot_id = await createCollectionSlot(collection.id)
            } catch (error) {
                throw error
            }

            for( let rarity_id in slot){
                try {
                    await createSlotRarityChance({slot_id, rarity_id, chance: slot[rarity_id]})
                } catch (error) {
                    throw error
                }
            }
        }
    }
}

const checkSlotRarityChance = (slot) => {
    let total_chance = 0
    for(let rarity_id in slot){
        total_chance+= slot[rarity_id]
    }
    return total_chance == 100
}

const generateImportCollectionsConfig = () => {
    let configs_names = readDir(`${paths.import_collections_configs_dir}`)

    if(configs_names && configs_names.is_error)
        return configs_names

    let import_configs = []

    for(let config_name of configs_names){
        let data = readFile(`${paths.import_collections_configs_dir}/${config_name}`)

        if(data && data.is_error)
            return data
        
        let config = JSON.parse(data)

        if(!config){
            let date = Date.now()
            let code = 'sy-1'
            let message = `${errors[code].message}`
            let details = data
            let error_id = 'generateImportCollectionsConfig'
            let error = new Error(code, message, details, date, error_id)
            logToFile(error)
            return error
        }

        decks_rarities_dirs = readDir(`${paths.import_collections_decks_dir}/${config.id}`)

        if(decks_rarities_dirs && decks_rarities_dirs.is_error)
            return decks_rarities_dirs

        let cards = []

        for(let deck_rarity_dir of decks_rarities_dirs){
            let deck_rarity_cards = readCardsFromDecks(`${paths.import_collections_decks_dir}/${config.id}/${deck_rarity_dir}`)
            
            if(deck_rarity_cards && deck_rarity_cards.is_error)
                return deck_rarity_cards

            let junk_value = config.junk_values[deck_rarity_dir] || 0
            for(let index in deck_rarity_cards)
                cards.push({card_id: deck_rarity_cards[index].id, rarity_id: deck_rarity_dir, junk_value})
            
        }

        for(let slot of config.slots){
            if(!checkSlotRarityChance(slot)){
                let date = Date.now()
                let code = 'cl-1'
                let message = `${errors[code].message}`
                let details = JSON.stringify(slot)
                let error_id = 'generateImportCollectionsConfig3'
                let error = new Error(code, message, details, date, error_id)
                logToFile(error)
                return error
            }
        }

        import_configs.push({...config, cards, cards_per_pack: config.slots.length, total_cards: cards.length})
    }

    let resp = writeFile(`${paths.import_collections_config}`, JSON.stringify(import_configs))

    if(resp && resp.is_error)
        return resp
}

const getCollectionInfo = async (collection_id) => {
    let collection_info = {}
    try {
        collection_info = await readCollection(collection_id)
    } catch (error) {
        throw error
    }

    try {
        collection_info.cards = await readCollectionCards(collection_info.id)
    } catch (error) {
        throw error
    }

    collection_info.slots = []
    try {
        let slots = await readCollectionSlots(collection_info.id)
        for(let slot of slots){
            let slot_info = {}
            try {
                let slot_rarities_chances = await readSlotRaritiesChances(slot.id)
                for (let slot_rarity_chance of slot_rarities_chances){
                    slot_info[slot_rarity_chance.rarity_id] = slot_rarity_chance.chance
                }
                collection_info.slots.push(slot_info)
            } catch (error) {
                throw error
            }
        }
    } catch (error) {
        throw
    }

    resolve(collection_info)
}

// const generateCard =

module.exports = {
    importCollections,
    generateImportCollectionsConfig,
    checkSlotRarityChance,
    getCollectionInfo,
}