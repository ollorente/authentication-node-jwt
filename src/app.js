require('dotenv').config()
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

/*  Middlewares*/
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

/* Routes */
app.use('/api/v1', require('./routes'))

/* Static files */
app.use(express.static(path.join(__dirname, 'public')))

/* Error */
app.get('*', (req, res) => {
    res.status(404).json({
        error: `Page don't found! :(`
    })
})

module.exports = app