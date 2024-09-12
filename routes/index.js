const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Book = require('../models/Books');
const Genre = require('../models/Genre');
const router = express.Router();

// Gemini
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Book Routes
router.post('/books/upload', upload.single('image'), async (req, res) => {
    try {
        const { bookName, authorName, edition, condition, genre } = req.body;
        const image = req.file.path;

        const newBook = new Book({
            bookName,
            authorName,
            edition,
            condition,
            image,
            genre
        });

        await newBook.save();
        res.status(201).json({ message: 'Book uploaded successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading book', error });
    }
});

router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/gist/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const prompt = `Provide a short story or gist about the book "${book.bookName}" written by ${book.authorName}, in about 80-100 words. But remember not give a spoiler and leave the gist on a end so that people get excited to read it.`;

        // Generate content using the model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const gist = await response.text();

        // Clean the text by removing ** and \n
        // const cleanGist = gist.replace(/\*\*/g, '').replace(/\n/g, ' ');
        const cleanGist = gist
        .replace(/\*\*/g, '')
        .replace(/\n/g, ' ')
        .replace(/\\\\/g, '\\')
        .replace(/\\"/g, '"');

        res.json({ gist: cleanGist.trim() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Genre Routes
router.post('/genres', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file.path;

        const newGenre = new Genre({ name, image });
        await newGenre.save();

        res.status(201).json({ message: 'Genre added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding genre', error });
    }
});

router.get('/genres', async (req, res) => {
    try {
        const genres = await Genre.find();
        res.json(genres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/genres/books', async (req, res) => {
    try {
        const genres = req.query.genres.split(',');
        const books = await Book.find({ genre: { $in: genres } });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
