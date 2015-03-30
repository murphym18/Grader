var assert = require('assert');
var path = require("path");

var express = require('express');
var connect = require('connect');
var passport = require('passport');
var localAuth = require(__dirname + '/../js/admin/local-auth');

var rest = require(__dirname + '/rest');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
app.disable("view engine");
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

passport.use(localAuth.strategyFactory(app));
app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
       // If this function gets called, authentication was successful.
       // `req.user` contains the authenticated user.
       res.redirect('/users/' + req.user.username);
    });

rest.forEach(function(o) {
   app.get('/ws' + o.path, o.funcFactory(app));
});

app.use('/js/', express.static('public/javascript'));
app.use('/', express.static('public'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
   app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
         message: err.message,
         error: err
      });
   });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
      message: err.message,
      error: {}
   });
});

module.exports = app;