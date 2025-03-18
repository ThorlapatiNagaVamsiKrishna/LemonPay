const express = require('express')
const User = require('./databaseModel.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()

const authenticationMiddleware = async (request, response, next) => {
    const jwtToken = request.headers["authorization"]?.split(' ')[1];
    try {
        if (jwtToken === undefined) {
            response.status(401).json({ message: 'You have no permission to access' })
        }
        else {
            jwt.verify(jwtToken, 'MY_SECREATE_TOKEN', async (error, payload) => {
                if (error) {
                    response.status(401).json({ message: 'Invalid JWT Token' })
                }
                else {
                    request.user = payload
                    next()
                }
            })
        }
    } catch (e) {
        response.status(401).json({ message: 'Invalid or expired token', error: e.message })
    }
}

router.post('/register', async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email })
        if (!user) {
            const hashedPassword = await bcrypt.hash(request.body.password, 10)
            const userData = { ...request.body, password: hashedPassword }
            const newUser = new User(userData)
            await newUser.save()
            response.status(201).json({ message: 'User created successfully', user: newUser })
        }
        else {
            response.status(201).json({ message: 'User already exists' })
        }
    }
    catch (e) {
        response.status(500).json({ message: e.message })
    }
})

router.post('/login', async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email })
        if (!user) {
            response.status(404).json({ message: 'user not found' })
        }
        else {
            const existingUser = await bcrypt.compare(request.body.password, user.password)
            if (existingUser) {
                const payload = { email: user.email, id: user._id }
                const jwtToken = jwt.sign(payload, 'MY_SECREATE_TOKEN', { expiresIn: '6h' })
                response.status(200).json({ jwtToken })
            }
            else {
                response.status(404).json({ message: 'password was incorrect' })
            }
        }
    }
    catch (e) {
        response.status(500).json({ message: e.message })
    }
})


router.put('/reset', async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email })
        if (user) {
            const hashedPassword = await bcrypt.hash(request.body.password, 10)
            const changeData = await User.findOneAndUpdate({ email: user.email },
                { '$set': { password: hashedPassword } },
                { new: true })
            response.status(201).json({
                message: 'passoword updated successfully',
                user: changeData
            })
        }
    }
    catch (e) {
        response.status(500).json({ message: e.message })
    }
})

router.post('/addTask', authenticationMiddleware, async (request, response) => {
    const { id, email } = request.user
    const user = await User.findByIdAndUpdate({ _id: id },
        {
            $push: { tasksList: { ...request.body } }
        },
        { new: true })
    response.status(200).json({ message: 'task added succuessfully', user })
})

router.get('/allTasks', authenticationMiddleware, async (request, response) => {
    const { id, email } = request.user
    const tasksList = await User.findOne({ _id: id }, { tasksList: 1, _id: 0 })
    response.status(200).json({
        tasksList: tasksList.tasksList
    })
})

module.exports = router