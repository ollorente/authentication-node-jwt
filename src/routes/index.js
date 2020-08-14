const api = require('express').Router()
const verify = require('../helpers/verifyToken')

const {
    Auth,
    User
} = require('../controller')

api.route('/login')
    .post(Auth.login)

api.route('/profile')
    .get(verify, User.profile)

api.route('/register')
    .post(Auth.register)

api.route('/users')
    .get(User.list)

api.route('/users/:id')
    .get(User.get)
    .put(User.update)

api.route('/users/search/:id')
    .get(User.search)

api.route('*', (req, res) => {
    res.status(404).json({
        message: `Page don't found! :(`
    })
})

module.exports = api