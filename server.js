const _ = require("lodash");
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');
const app = express();
const mountRoutes = require('./server/routes')
const passport = require("passport");
const passportJWT = require("passport-jwt");
const pbkdf2 = require('pbkdf2')
mountRoutes(app)

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

//test array
var users = [
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

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  var user = users[_.findIndex(users, {id: jwt_payload.id})];
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
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

app.post("/login", function(req, res) {
    if(req.body.username && req.body.password){
      var username = req.body.username;
      var password = pbkdf2.pbkdf2Sync(req.body.password, 'majuriSuolaus', 2149, 128, 'sha512').toString('hex');
    }
    return this._http.post("/api/users", username, password).map(result => this.result = result.json().data);
    var user_id = users[_.findIndex(users, {username: username})];
    if( ! user ){
      res.status(401).json({message:"no such user found"});
    }
    if(user.password === req.body.password) {
      // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
      var payload = {id: user.id};
      var token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({message: "ok", token: token, password: password});
    } else {
      res.status(401).json({message:"passwords did not match"});
    }
});

app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    res.json("Success! You can not see this without a token");
});

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));