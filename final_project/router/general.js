const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username != null && password != null){

      if(isValid(username)){
        users.push({
          'username':username,
          'password': password})
        res.send(`User ${username} registered Succesfully!`)
      }
  
      res.send('Username Already Exists')
    }

    res.send("Registration Error")
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  await res.send(JSON.stringify(books, null, 5))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  if(req.params.isbn>=1 && req.params.isbn<=10){
    await res.send(books[req.params.isbn])
  }
  await res.send('Book not Available')
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  if(author){
    for(let i=0; i<=9 ;i++){
      if(Object.values(books)[i].author ==  req.params.author){
        await res.send(books[i+1])
      }
    }
    await res.send('Author not Found!')
  }
  await res.send("Author Not Provided!")
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title
  if(title){
    for(let i=0; i<=9 ;i++){
      if(Object.values(books)[i].title ==  req.params.title){
        await res.send(books[i+1])
      }
    }
    await res.send('Title not Found!')
  }
  await res.send("Title Not Provided!")
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  let isbn = req.params.isbn
  if(isbn){
    if(isbn>=1 && isbn<=10){
      await res.send(books[isbn].reviews)
    }
    await res.send("ISBN Not Valid!")
  }
  await res.send("ISBN Not Provided!")
});

module.exports.general = public_users;
