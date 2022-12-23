const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')
const controller  = express.Router()

const { generateAccessToken } = require('../middlewares/authorization')
const usersSchema = require('../schemas/userSchema')

// unsecurd routes
controller.route('/signup').post(async(req, res) => {
    const {firstName, lastName, email, password} = req.body

    if (!firstName || !lastName || !email || !password)
        res.status(400).json({text: 'first name, last name, email and password is required.'})

    const exists = await usersSchema.findOne({email})
    if (exists)
        res.status(400).json({text: 'a user with the same e-mail adress already exists'})
    else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await usersSchema.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        if (user) 
            res.status(201).json({test: 'your user account was created successfully.'})
        else
            res.status(400).json({test: 'something when wrong when we tried to create your user account.'})
    }

})

controller.route('/signin').post(async(req, res) => {
    const {email, password} = req.body

    if (!email || !password)
        res.status(400).json({text: 'email and password is required.'})

    const user = await usersSchema.findOne({email})
    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            accessToken: generateAccessToken(user._id)
        })
    } else {
        res.status(400).json({test: 'incorrect email or password.'})
    }

})


module.exports = controller