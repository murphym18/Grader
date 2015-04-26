/**
@author Michael Murphy
*/
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var config = require('./config');
var util = require('./util');

var session = require('express-session');
var SessionStore = require('session-file-store')(session);
var min = 60 * 1000;

function generateSecret(){
   var buf = crypto.randomBytes(256);
   var hash = crypto.createHash('sha256');
   hash.update(buf);
   return hash.digest('base64');
}

var absPath = path.resolve(config.session.path);
if (config.createMissingDirectories && !fs.existsSync(absPath)) {
   console.warn("Creating directory for session files: \"" + absPath + "\"");
   util.makeDirectoryPlusParents(absPath);
}

var secret = config.session.secret;
if (secret == null) {
   secret = generateSecret();
}

module.exports = session({
   store: new SessionStore({path: absPath}),
   secret: secret,
   resave: false,
   saveUninitialized: false,
   name: 'sid'
});


