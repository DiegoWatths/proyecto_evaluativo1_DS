#!/usr/bin/env

const express = require("express");
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport');
const passportLocal = require("passport-local").Strategy;
const session = require('express-session')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3900;
const HOST = process.env.HOST || "127.0.0.1";

const User = require("./models/User")

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: "http://127.0.0.1:4000", // <-- location of the proxy server
    credentials: true,
}));

app.use(session({
    secret: "secreto secretoso secrético",
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
require("./passport/passport-config")(passport);

mongoose.connect("mongodb://localhost/users", () => console.log("Connected to db"));

app.post("/register", async (req, res) => {
    try {
        const {username: Usern, password: pass} = req.body;
        const hashedPassword = await bcrypt.hash(pass, 10);
        
        const user = new User({username: Usern, password: hashedPassword })
        await user.save();

        console.log("New User registered!")
        console.table({Username: Usern, Password: pass, HashedPassword: hashedPassword});

        res.status(201).send("Succesfully registered")
    } catch (error) {
        console.error(error)
    }
})

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.status(401).send("Wrong Username or Password, please Try again");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send("Successfully Authenticated");
          console.log(req.user);
        });
      }
    })(req, res, next);
  });

app.use((req, res) => {
    console.log(req.body);
})
    
app.listen(PORT, () => console.log(`Este servicio corre en http://${HOST}:${PORT}`))