const api = require('express').Router()
const verify = require('../helpers/verifyToken')

const {
    Auth
} = require('../controller')

api.route('/')
    .get(verify, (req, res) => {
        res.status(200).json({
            message: `Welcome to API!`
        })
    })

api.route('/register')
    .post(Auth.register)

api.route('/login')
    .post(Auth.login)

module.exports = api