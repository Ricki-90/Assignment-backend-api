const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    firstName: {type: String, required: [true, 'please entre a first name']},
    lastName: {type: String, required: [true, 'please entre a last name']},
    email: {type: String, required: [true, 'please entre an email adress'], unique: true},
    password: {type: String, required: [true, 'please entre a password']}

})

module.exports = mongoose.model("users", usersSchema)