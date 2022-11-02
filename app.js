//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema);
app.get("/", function (require, res) {
    res.render("home");
});

app.get("/login", function (require, res) {
    res.render("login");
});

app.get("/register", function (require, res) {
    res.render("register");
});

app.post("/register", function (require, res) {
    const userName = require.body.username;
    const password = require.body.password;

    const newUser = new User({
        email: userName,
        password: password
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("secrets");
        }
    });
});

app.post("/login", function (require, res) {
    const userName = require.body.username;
    const password = require.body.password;

    User.findOne({ email: userName }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    })
});




app.listen(3000, function () {
    console.log("Server started on port 3000.")
});