var app = require('express')();
var passport = require('passport');
var LoginStrategy = require('passport-local').Strategy;
var Users = require.main.require('./model/admin/user');
var co = require('co');

function requireLogin(req, res, next) {
   if (req.isAuthenticated()){
      return next();
   }
   else {
      res.json({error: "nologin"});
   }
}

var router = require('express').Router();

router.post('/login', function(req, res, next) {
   passport.authenticate('local', function(err, user) {
      if (err)
         return next(err);
      if (!user) {
         return res.json({
            login: false,
            message: "Invalid Username or Password."
         });
      }
      req.logIn(user, function(err) {
         if (err) {
            return next(err);
         }
         return res.json({
            login: true,
            user: user
         });
      });
   })(req, res, next);
});

router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/login');
});

passport.serializeUser(function (user, done) {
   done(null, user.username);
});

passport.deserializeUser(function(user, done) {
   co(function *() {
      try {
         var result = yield Users.findOne({username: user}).exec();
         console.log(result);
         done(null, result);
      }
      catch (err) {
         done(err);
      }
   })
});

passport.use(new LoginStrategy(function(user, pass, done) {
   co(function *() {
      var query = Users.findOne({username: user, password: pass});
      try {
         var result = yield query.exec();
         console.log(result);
         done(null, result);
      }
      catch (err) {
         done(err);
      }
   })
}));

exports.routes = router;
exports.requireLogin = requireLogin;

