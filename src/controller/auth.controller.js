const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const app = {}

const {
    loginValidation,
    registerValidation
} = require('../helpers/validation')
const random = require('../helpers/randomNumber')

const {
    Token,
    User
} = require('../model')

app.register = async (req, res, next) => {
    /* Validate data */
    const {
        error
    } = registerValidation(req.body)
    if (error) return res.status(400).json(error.details[0].message)

    /* Checking if the user is already in the database */
    const emailExist = await User.findOne({
        email: req.body.email
    })
    if (emailExist) return res.status(400).json({
        error: `Email already exist!`
    })

    async function createUID() {
        const uidRandom = await random()
        const userInfo = await User.findOne({
            uid: uidRandom
        })
        if (userInfo) {
            createUID()
        } else {
            /* Hash password */
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)

            const newData = new User({
                displayName: req.body.displayName || '',
                email: req.body.email,
                password: hashedPassword,
                phoneNumber: req.body.phoneNumber || '',
                photoURL: req.body.photoURL || '',
                uid: uidRandom
            })

            let result
            try {
                result = await newData.save()
            } catch (error) {
                return next(error)
            }

            res.status(201).json({
                displayName: result.displayName,
                email: result.email,
                phoneNumber: result.phoneNumber,
                photoURL: result.photoURL,
                providerId: 'MyAuth',
                uid: result.uid
            })
        }
    }
    createUID()
}

app.login = async (req, res, next) => {
    /* Validate data */
    const {
        error
    } = loginValidation(req.body)
    if (error) return res.status(400).json({
        error: error.details[0].message
    })

    /* Checking if the user is already in the database */
    const user = await User.findOne({
        email: req.body.email
    })
    if (!user) return res.status(400).json({
        error: `Email or password in wrong!`
    })

    /* Password in correct */
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) res.status(400).json({
        error: `Email or password in wrong!`
    })

    async function createUID() {
        const uidRandom = await random()
        const tokenInfo = await Token.findOne({
            jwtid: uidRandom
        })
        if (tokenInfo) {
            createUID()
        } else {
            const newData = new Token({
                jwtid: uidRandom
            })

            let token
            try {
                await newData.save()

                token = JWT.sign({
                    _id: user._id
                }, process.env.SECRET_KEY, {
                    expiresIn: '1h',
                    jwtid: uidRandom
                })
            } catch (error) {
                return next({
                    error: error.details[0].message
                })
            }

            res.status(200).header('Authorization', token).json({
                jwt: token
            })

        }
    }
    createUID()
}

module.exports = app