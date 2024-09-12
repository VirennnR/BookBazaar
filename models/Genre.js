const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model('Genre', genreSchema);
