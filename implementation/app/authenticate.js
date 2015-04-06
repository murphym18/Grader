var app = require('express')();
var passport = require('passport');
var LoginStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Users = require.main.require('./model/admin/user');
var co = require('co');

function requireLogin(req, res, next) {
   if (req.isAuthenticated()){
      return next();
   }
   else {
      req.session.goto = req.originalUrl;
      res.redirect('/login');
   }
}

var router = require('express').Router();

router.get('/login', function(req, res) {
   if (req.isAuthenticated()) {
      res.redirect('/user/' + req.user.username);
   }
   res.render('login', {
      "user": req.user,
      "goto": req.goto,
      "message": req.query.error === 'invalid' ? "Invalid Username or Password." : req.query.error !== undefined ? "Unknown error." : null
   });
});


router.post('/login', passport.authenticate('local', {failureRedirect: '/login?error=invalid'}), function(req, res) {
   var goto = req.session.goto;
   if (goto)
      delete req.session.goto;
   else
      goto = '/user/' + req.user.username;
   res.redirect(goto);
});

router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/login');
});

passport.serializeUser(function (user, done) {
   done(null, user.username);
});

passport.deserializeUser(function(user, done) { co(function *() {
   try {
      var result = yield Users.findOne({username: user}).exec();
      console.log(result);
      done(null, result);
   }
   catch (err) {
      done(err);
   }
})});

passport.use(new LoginStrategy(function(user, pass, done) { co(function *() {
   var query = Users.findOne({username: user, password: pass});
   try {
      var result = yield query.exec();
      console.log(result);
      done(null, result);
   }
   catch (err) {
      done(err);
   }
})}));

exports.routes = router;
exports.requireLogin = requireLogin;

