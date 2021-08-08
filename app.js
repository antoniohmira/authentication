//jshint esversion:6
require('dotenv-extended').load(); //to use environment variables

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

//This code is just to see the content of the environment varia
console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//connect to the database.  The database is userDB
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true,  useUnifiedTopology: true });

//create the user schema
 const userSchema = new mongoose.Schema ({
    email: String,
    password: String
 });

 //plugin the "key" BEFORE the model is used only encrypting the password
 const secret = process.env.SECRET;
 userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"]});


//crete the model for the user database
const User = new mongoose.model("User", userSchema);

 app.get("/", function(req, res) {
   res.render("home");
 });

 app.get("/login", function(req, res) {
   res.render("login");
 });

 app.get("/register", function(req, res) {
   res.render("register");
 });


 //code for when button is pressed in the register page. (post)
 app.post("/register", function(req, res){
   //create new object with the data entered in the web page
   const newUser = new User({
     email: req.body.username,
     password: req.body.password
   });
   newUser.save(function(err){
     if (err) {
       console.log(err);
     } else { //no errors
       res.render("secrets");
     }
   });
 });

 //code for when the button is pressed in the login page
 app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
            if (foundUser.password === password) {
              res.render("secrets");
            }
        }

      }
    });
 });






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
