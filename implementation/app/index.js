/**
 * Initializes the application and exports an emitter. Users of this module can
 * listen on the following events:
 * <ul>
 *    <li>
 *       'database' triggered when the database is ready.
 *          functions get called with the db object and no other arguments.
 *    </li>
 *    <li>'routers' triggered when the application routers should be setup</li>
 *    <li>'ready' triggered after everything in this module is initialized.</li>
 * </ul>
 * @type {exports is an emitter.}
 */
var events = require('events');
var EventEmitter = events.EventEmitter;
module.exports = new EventEmitter();

var assert = require('assert');
var database = require('./database');
var express = require('express');
var engine = require('ejs-locals');
var logger = require('morgan');
var SessionLoader = require('./session');
var bodyParser = require('body-parser');
var passport = require('passport');
var error = require('./errors');

var app = express();
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

database.on('ready', function(db) {
   var auth = require('./authenticate')(db, passport);
   app.use(SessionLoader);
   app.use(passport.initialize(), passport.session());
   app.use("/", auth.routes);

   setImmediate(function() {
      module.exports.emit('db', db);

      setImmediate(function() {
         module.exports.emit('routers', app);
         app.use(express.static('public'));
         app.use(error["404"])
         app.use(error["500"]);

         setImmediate(function() {
            SetupPassport();
            module.exports.emit('ready', app);
         });
      });
   });

   function SetupPassport() {
      passport.serializeUser(function (user, done) {
         done(null, user._id);
      });
      passport.deserializeUser(function (id, done) {
         var query = { "_id": db.createId(id) };
         db.collection('users').find(query).toArray(function(err, user) {
            assert.fail(err, null, "Error: couldn't deserialize user: " + id);
            done(err, user[0]);
         });
      });
      passport.use(auth.LocalUser());
   }
});


