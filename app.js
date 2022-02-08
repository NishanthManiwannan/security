//--------- required
require('dotenv').config();

const express = require("express"),
  bodyParser = require("body-parser"),
  ejs = require("ejs");
const mongoos = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express(); 

console.log(process.env.API_KEY);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoos.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

//Encription password
const userSchema = new mongoos.Schema ({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})
//-----------------------------------------------------------------------------

const User = new mongoos.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email : req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets")
        }
    })
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email : username}, function(err, foundUSser){
        if(err){
            console.log(err);
        }else{
            if(foundUSser){
                if(foundUSser.password === password){
                    res.render("secrets");
                }
            }
        }
    })
})

//host server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
