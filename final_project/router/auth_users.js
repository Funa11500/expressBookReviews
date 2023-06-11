const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let flag = true;

  users.map((user)=>{
    if(user.username == username){
      //Username Already Exists. 
      flag = false
    }
  })

  return flag
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let flag = false;
  users.map((user)=>{
    if(user.username == username && user.password == password){
      //Username Already Exists.
      flag = true;
    }
  })
  return flag
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
   }
   return res.status(200).send("User successfully logged in");

  }
  return res.status(208).json({message: "Invalid Login. Check username and password"});
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let bookNum = req.params.isbn
  let review = req.query.rev
  if(!bookNum || !review){
    res.send('Please provide an ISBN number along a Review.')
  }

  if(bookNum>=1 && bookNum<=10){
    //A Valid Book
    let user = req.session.authorization['username'];
    let newReview = {'review': review};
    books[bookNum].reviews[user] = newReview;
    res.send('Review Added Succesfully!');
  }
  else{
    res.send('Please Provide a Valid ISBN Number')
  }

});

// Delete a Book review

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let bookNum = req.params.isbn;
  if(!bookNum){
    res.send('Please provide an ISBN number')
  }
  
  if(bookNum>=1 && bookNum<=10){
    //A Valid Book
    let user = req.session.authorization['username'];
    delete books[bookNum].reviews[user]
    res.send('Review Deleted Succesfully!');
  }
  else{
    res.send('Please Provide a Valid ISBN Number')
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
