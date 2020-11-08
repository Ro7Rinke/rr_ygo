import fs from 'fs'
import {paths} from '../data/system_info'

export const between = (max, min) => {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

export const logToFile = (error) => {
    fs.writeFileSync(`${paths.log_dir}/${Date.now()}.log`, JSON.stringify(error))
}