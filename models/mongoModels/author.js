const mongoose = require('mongoose')
const Schema = mongoose.Schema

let schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
})

module.exports = mongoose.model('Author', schema, 'author')