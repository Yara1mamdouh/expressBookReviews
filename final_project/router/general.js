const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  users.push({
    username,
    password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});

// Task 1: Get all books
public_users.get('/', (req, res) => {
  return res.json(books);
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.json(books[isbn]);
});

// Task 3: Get books by author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;

  const booksByAuthor = [];

  Object.keys(books).forEach((isbn) => {
    if (
      books[isbn].author.toLowerCase() === author.toLowerCase()
    ) {
      booksByAuthor.push(books[isbn]);
    }
  });

  return res.json(booksByAuthor);
});

// Task 4: Get books by title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;

  const booksByTitle = [];

  Object.keys(books).forEach((isbn) => {
    if (
      books[isbn].title.toLowerCase() === title.toLowerCase()
    ) {
      booksByTitle.push(books[isbn]);
    }
  });

  return res.json(booksByTitle);
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;