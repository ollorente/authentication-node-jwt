const bcrypt = require('bcryptjs')
const app = {}

const {
    limit,
    page
} = require('../helpers/pagination')
const {
    registerValidation
} = require('../helpers/validation')

const {
    User
} = require('../model')

app.list = async (req, res, next) => {
    let result
    try {
        result = await User.find({}, {
                _id: 0,
                displayName: 1,
                photoURL: 1,
                uid: 1,
                updatedAt: 1
            })
            .limit(limit).skip(page).sort({
                displayName: 1,
                email: 1
            })
    } catch (error) {
        return next({
            error: error.details[0].message
        })
    }

    res.status(200).json(result)
}

app.get = async (req, res, next) => {
    const {
        id
    } = req.params

    let result
    try {
        result = await User.findOne({
            uid: id
        }, {
            _id: 0,
            email: 0,
            password: 0,
            __v: 0
        })
    } catch (error) {
        return next({
            error: error.details[0].message
        })
    }
    res.status(200).json(result)
}

app.update = async (req, res, next) => {
    const { id } = req.params
    const update = req.body

    const userInfo = await User.findOne({ uid: id })
    if (!userInfo) return res.status(500).json({
        message: `User don't found!`
    })

    /* Validate data */
   /*  const {
        error
    } = registerValidation(update)
    if (error) return res.status(400).json(error.details[0].message)
 */
    let result
    try {
        if (update.password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(update.password, salt)

            update.password = hashedPassword
        }

        result = await User.updateOne({
            _id: userInfo._id
        }, {
            $set: update
        }, {
            new: true
        })
    } catch (error) {
        return next({
            error: error.details[0].message
        })
    }

    res.status(200).json({
        data: result
    })
}

app.search = async (req, res, next) => {
    const {
        id
    } = req.params

    let result
    try {
        result = await User.find({
                displayName: {
                    $regex: id
                }
            }, {
                _id: 0,
                displayName: 1,
                photoURL: 1,
                uid: 1,
                updatedAt: 1
            })
            .limit(limit).skip(page).sort({
                displayName: 1,
                email: 1
            })
    } catch (error) {
        return next({
            error: error.details[0].message
        })
    }

    res.status(200).json(result)
}

app.profile = async (req, res, next) => {
    let result
    try {
        result = await User.findOne({
            _id: req.user._id
        }, {
            _id: 0,
            password: 0,
            __v: 0
        })
    } catch (error) {
        return next({
            error: error.details[0].message
        })
    }

    res.status(200).json(result)
}

module.exports = app