import Sqlite3 from 'sqlite3'
import {logToFile} from './common'
import {errors, paths} from '../data/system_info'
import Error from './class/Error'

export const getUserInfo = (id) => {
    
    let response = null

    let db = new Sqlite3.Database(paths.db_rr_ygo_3, (error) => {
        if(error){
            let date = Date.now()
            let code = 'db-1'
            let message = `${errors['db-1'].message} ${paths.db_rr_ygo_3}`
            let details = JSON.stringify(error)
            logToFile(new Error(code, message, details, date))
            return
        }
    })

    let sql = `SELLECT nick, name, cash, rp, sealed_rp, unchecked_games, ranked_wins, ranked_defeats, ranked_draws, sealed_unchecked_games, sealed_wins, sealed_defeats, sealed_draws FROM user WHERE id = ?`
    let params = [id]

    db.get(sql, params, (error, row) => {
        if(error){
            let date = Date.now()
            let code = 'db-2'
            let message = `${errors['db-2'].message}, all infos of User ID "${id}" from ${paths.db_rr_ygo_3}`
            let details = JSON.stringify(error)
            logToFile(new Error(code, message, details, date))
            return
        }

        if(row){
            response = {...row, id}
        }else{
            let date = Date.now()
            let code = 'db-3'
            let message = `${errors['db-3'].message} User ID "${id}" from ${paths.db_rr_ygo_3}`
            let details = JSON.stringify(error)
            logToFile(new Error(code, message, details, date))
            return
        }
    })

    return response
}