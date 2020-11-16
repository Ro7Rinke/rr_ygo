const fs = require('fs')
const { paths } = require('../data/system_info')

const between = (max, min) => {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

const logToFile = (error) => {
    fs.writeFileSync(`${paths.log_dir}/${Date.now()}.log`, JSON.stringify(error))
}

module.exports = { between, logToFile }