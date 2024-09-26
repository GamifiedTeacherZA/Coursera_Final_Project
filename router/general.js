const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 06
public_users.post("/register", (req,res) => {
    const userName = req.body.username;
    console.log(req.body);
    const passWord = req.body.password;
    //console.log(req);
    if (userName && passWord) {
        if (!isValid(userName)) {
            users.push({"username":userName,"password":passWord});
            return res.status(200).json({message:`User ${userName} registered`});
        }
        else {
            return res.status(400).json({message:`User ${userName} already registered`});
        }
    }
    else {
        return res.status(404).json({message: "Missing Username and/or Password"});
    }
});

// Task 10, 12 and 13
// Created async Promise function to fetch books without stalling server
// Was thinking of making different functions like for ISBN, but feels like reinventing the wheel...:-)
function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Get the book list available in the shop
// Task 01
public_users.get('/', function (req, res) {
    getBooks().then((booksList) => res.send(JSON.stringify(booksList)));
});

// Task 11
// Created async Promise function to fetch books via ISBN without stalling server
function getByIsbn(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNumber = parseInt(isbn);
        if (books[isbnNumber]) {
            resolve(books[isbnNumber]);
        } else {
            reject({status:404, message:`${isbn} not found`});
        }
    })
}
// Get book details based on ISBN
// Task 02
public_users.get('/isbn/:isbn', function (req, res) {
    getByIsbn(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});
  
// Get book details based on author
// Task 03
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title
// Task 04
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get book review
// Task 05
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getByIsbn(req.params.isbn)
  .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({message: error.message})
  );
});

module.exports.general = public_users;