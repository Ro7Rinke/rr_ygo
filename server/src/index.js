const createUserInfo = require('./db').createUserInfo
const readUserInfo = require('./db').readUserInfo
const readUserSpecific = require('./db').readUserSpecific
const updateUserSpecific = require('./db').updateUserSpecific
const login = require('./user').login
const readUserCards = require('./db').readUserCards
const readDir = require('./db').readDir
const importCardsFromDecks = require('./card').importCardsFromDecks

const main = async () => {
    let user = {
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
    
    let user2 
    importCardsFromDecks()
    // try{
    //     user2 = await readUserCards(user.id)
    //     console.log(user2)
    // }catch(error){
    //     console.log(error)
    // }
}

main()