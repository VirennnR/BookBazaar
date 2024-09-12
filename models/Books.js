const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    authorName: { type: String, required: true },
    edition: { type: String, required: true },
    condition: { type: String, required: true },
    image: { type: String, required: true },
    genre: { type: String, required: true }
});

module.exports = mongoose.model('Book', bookSchema);