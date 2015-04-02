module.exports = function(db, passport) {
   var config = require('./config');
   var passHash = require('./security').passHash;
   var assert = require('assert');

   var LocalAuthStrategy = require('passport-local').Strategy;
   var CasAuthStrategy = require('passport-cas').Strategy;

   var admin = require('../model/admin');
   var LocalIdentity = admin.LocalIdentity;
   var Identity = admin.Identity;

   /**
    * Given an identity, this function finds it and calls done with the user or
    * with false if no user exists.
    *
    * T
    * @param identity
    * @param done
    */
   function authUser(identity, done) {
      console.log(identity);
      var query = {
         "identities":  identity
      };

      var options = {
         "limit": 1
      };

      global.db.collection("users").find(query, options).toArray(cb);

      function cb(err, result) {
         console.log("user login:", result);

         assert.equals(null, err);
         if (null !== err)
            done(err);
         else if (result.length > 0)
            done(null, result[0]);
         else
            done(null, false);
      }
   }

   function checkUserDb() {
      function authFunc(username, password, done) {
         authUser(new LocalIdentity(username, passHash(password)), done);
      }
      return new LocalAuthStrategy(authFunc);
   }

   function casFactory() {
      function authFunc(login, done) {
         authUser(new Identity(login, config.cas.ssoBaseURL), done);
      }
      return new CasAuthStrategy(config.cas, authFunc);
   }

   function setupRoutes() {
      var router = require('express').Router();
      var passport = require('passport');

      router.get('/login', function(req, res) {
         console.log(req.user);
         res.render('login', {
            "user": req.user,
            "goto": req.goto,
            "message": req.query.message
         });
      });

      var options = {
         failureRedirect: '/login?message=' + encodeURIComponent("Invalid Username or Password.")
      }

      router.post('/login', passport.authenticate('local', options), function(req, res) {
         var goto = req.session.goto;
         if(goto)
            delete req.session.goto;
         else
            goto = '/';

         res.redirect(goto);
      });

      router.get('/logout', function(req, res) {
         req.logout();
         res.redirect('/login');
      });

      return router;
   }

   function ensureLogin(err, res, next){
      if (res.length > 0)
         next(new Error("Username Taken"));
      else {
         admin.createUser(req.body.first, req.body.last, function (err, result) {
            var query;
            if (db.isTingo) {
               query = { _id: result[0]._id };
            }
            else {
               query = { _id: result.ops[0]._id };
            }

            var change = { $push: {"identities": identity}};
            global.db.collection('users').update(query, change, function(err, result){
               console.log(result);
            });
         });
      }
   }

   return {
      "LocalUser" : checkUserDb,
      "CasUser": casFactory,
      "routes": setupRoutes,
      "requireLogin": ensureLogin
   };
}

