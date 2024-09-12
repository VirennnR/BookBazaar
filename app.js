require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const router = require('./routes/index');

const app = express();
const PORT = process.env.PORT;

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});


// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const booksRouter = require('./routes/book');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // MongoDB connection URI
// const uri = process.env.MONGODB_URI;

// // Connect to MongoDB using Mongoose
// mongoose.connect(uri)
//   .then(() => console.log('Connected to MongoDB!'))
//   .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
//     process.exit(1);
//   });

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/books', booksRouter);

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// }).on('error', (err) => {
//   console.error('Error starting server:', err);
// });
