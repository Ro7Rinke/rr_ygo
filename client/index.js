const axios = require('axios')
const port = 3000
const ip = 'http://localhost'

const main = async () => {
    try {
        let user = await axios.post(`${ip}:${port}/login`, {
            nick: 'nickname',
            password: 'hashpassword'
        })
        console.log(user)
    } catch (error) {
        console.log(error)
    }
}

main()