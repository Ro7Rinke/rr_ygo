const db = require('./db')
const common = require('./common')
const Error = require('./class/Error')
const system_info = require('../data/system_info')
const user = require('./user')
const deck = require('./deck')
const card = require('./card')

const main = async () => {
    let user1 = {
        id: '0ut4',
        password: 'hashpassword',
        name: 'Your Name',
        nick: 'nickname',
        cash: 5000,
        rp: 300,
        sealed_rp: 500,
        unchecked_games: 23,
        ranked_wins: 5,
        ranked_defeats: 7,
        ranked_draws: 1,
        sealed_unchecked_games: 7,
        sealed_wins: 2,
        sealed_defeats: 1,
        sealed_draws: 0,
    }
    
    let stTime = Date.now()
    
    
}

main()