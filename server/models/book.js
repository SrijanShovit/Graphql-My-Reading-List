const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String,
})

//Book will be collection name with schema as bookSchema
module.exports = mongoose.model('Book',bookSchema)