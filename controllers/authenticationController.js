const express = require('express')
const controller  = express.Router()

const usersSchema = require('../schemas/usersSchema')

// unsecurd routes
controller.route('/signup').post(async(req, res) => {
    const {firstName}
})