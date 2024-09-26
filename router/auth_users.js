
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const registeredUser = express.Router();

let users = [];

function isValid(username) {
    const userMatches = users.filter((user) => user.username === username);
    return userMatches.length > 0;
}

function authenticatedUser(username, password) {
    const matchingUsers = users.filter((user) => user.username === username && user.password === password);
    return matchingUsers.length > 0;
}

//only registered users can login
// Task 07
registeredUser.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({data:password}, "access", {expiresIn: 3600});
        req.session.authorization = {accessToken,username};
        return res.status(200).send("User successfully logged in");
    }
    else {
        return res.status(208).json({message: "Invalid username or password"});
    }
});

// Add a book review
// Task 08 to post review
registeredUser.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Review successfully posted");
    }
    else {
        return res.status(404).json({message: `${isbn} not found`});
    }
});

// Delete a book review
// Tast 09 to delete a review
registeredUser.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        delete book.reviews[username];
        return res.status(200).send("Review successfully deleted");
    }
    else {
        return res.status(404).json({message: `${isbn} not found`});
    }
});

module.exports.authenticated = registeredUser;
module.exports.isValid = isValid;
module.exports.users = users;
