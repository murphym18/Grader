var config = require('./config').session;
var fs = require('fs');
var session = require('express-session');
var SessionStore = require('session-file-store')(session);




module.exports = session({
   store: new SessionStore({path: config.path}),
   secret: config.secret,
   resave: false,
   saveUninitialized: false
});
