const fs = require('fs')
const paths = require('../data/system_info').paths

const between = (max, min) => {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

const logToFile = (error) => {
    fs.writeFileSync(`${paths.log_dir}/${Date.now()}.log`, JSON.stringify(error))
}

const toArray = (object) => {
    let array = []
    for(let index in object)
        array.push(object[index])

    return array
}
module.exports = { between, logToFile, toArray }