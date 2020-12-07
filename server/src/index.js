const express = require('express')
const port = 3000
const ip = 'http"//localhost'
const bodyParser = require('body-parser')
const {
    logToFile,
} = require('./common')
const Error = require('./class/Error')
const {
    errors,
} = require('../data/system_info')
const {
    login,
} = require('./user')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const main = async () => {

    app.post('/login', (req, res) => {
        if(!req.body || !req.body.nick || !req.body.password){
            let date = Date.now()
            let code = 'rq-1'
            let message = `${errors[code].message}`
            let details = `body: ${JSON.stringify(req.body)}`
            let error_id = 'main/login'
            let error = new Error(code, message, details, date, error_id)
            logToFile(error)
            res.status(400).send(error)
            return
        }

        login(req.body.nick, req.body.password)
            .then((resp) => {
                res.status(200).send(resp)
                return
            })  
            .catch((error) => {
                res.status(500).send(error)
                return
            })      
    })

    app.listen(port, () => {
        console.log(`listening at ${ip}:${port}`)
    })
}

main()