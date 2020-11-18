const {readFile, createRarity} = require('./db')
const {paths} = require('../data/system_info')
const {logToFile} = require('./common')

const importRarities = async () => {
    let config = readFile(paths.import_rarities_config)

    if(config && config.is_error){
        throw config
    }

    let rarities = JSON.parse(config)

    if(!Array.isArray(rarities)){
        let date = Date.now()
        let code = 'sy-1'
        let message = `${errors[code].message}`
        let details = ''
        let error_id = 'importRarities'
        let error = new Error(code, message, details, date, error_id)
        logToFile(error)
        throw error
    }

    for(let rarity of rarities){
        try {
            await createRarity(rarity)
        } catch (error) {
            throw error
        }
    }
}

module.exports = {
    importRarities,
}