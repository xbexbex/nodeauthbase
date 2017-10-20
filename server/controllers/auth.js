const express = require('express');
const app = module.exports = express();

const bodyParser = require('body-parser');
const _ = require("lodash");
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const pbkdf2 = require('pbkdf2');
var request = require('request');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

//test array
const users = [
    {
        id: 1,
        username: 'asdf',
        password: 'asdf'
    },
    {
        id: 2,
        username: 'test',
        password: 'test'
    }
];

// JWT login token
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'majorestOfSecrets';

function hashPassword(password) {
    var salt = "majuriSuolaus";
    return pbkdf2.pbkdf2Sync(
        password,
        salt,
        2149,
        128,
        'sha512'
    ).toString('hex');
}

const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    var user = users[_.findIndex(users, { id: jwt_payload.id })];
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy);

// Parsers
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

app.post("/login", function (req, res) {
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = hashPassword(req.body.password);
    }
    var user = users[_.findIndex(users, { username: username })];
    var user_id = "asdf";
    if(!user) {
        res.status(401).json({ message: "no such user found" });
    }
    if (user.password === req.body.password) {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        var payload = { id: user.id };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ message: "ok", token: token, password: password });
    } else {
        res.status(401).json({ message: "passwords did not match" });
    }
});

app.get("/test", function (req, res) {
    res.send("asdasd");
});

app.get("/", function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.sendFile(path.join(__dirname, 'dist/index.html'));
        });
      })(req, res, next);
});