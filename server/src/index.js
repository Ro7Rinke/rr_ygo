const createUserInfo = require('./db').createUserInfo
const readUserInfo = require('./db').readUserInfo

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
    
    user2 = await readUserInfo('user.id')
    if(user2.is_error){
        console.log('faiou')
        console.log(user2)
    }else{
        console.log(user2)
    }
    
    console.log(Date.now() - stTime)
}

main()