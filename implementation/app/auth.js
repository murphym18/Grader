var config = require('./config');
var assert = require('assert');
var LocalAuthStrategy = require('passport-local').Strategy;
var CasAuthStrategy = require('passport-cas').Strategy;
var admin = require('../model/admin');
var LocalIdentity = admin.LocalIdentity;
var Identity = admin.Identity;

function authUser(identity, done) {
   var query = {
      "identities":  identity
   };

   var options = {
      "limit": 1
   };

   global.db.collection("users").find(query, options).toArray(cb);

   function cb(err, result) {
      assert.equal(null, err);
      if (null !== err)
         done(err);
      else if (result.length > 0)
         done(null, result[0]);
      else
         done(null, false);
   }
}

module.exports = {
   "localFactory" : function() {
      function authFunc(username, password, done) {
         authUser(new LocalIdentity(username, passHash(password)), done);
      }
      return new LocalAuthStrategy(authFunc);
   },

   "casFactory": function () {
      function authFunc(login, done) {
         authUser(new Identity(login, config.cas.ssoBaseURL), done);
      }
      return new CasAuthStrategy(config.cas, authFunc);
   }
};

