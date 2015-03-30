var UserModule = require(__dirname + "/user");
var LocalAuthStrategy = require('passport-local').Strategy;
module.exports = {
   "strategyFactory" : function(app) {
      function authFunc(username, password, done) {
         var query = {
            "identities":  new UserModule.LocalIdentity(username, password)
         };

         var options = {
            "limit": 1
         };

         function cb(err, result) {
            assert.equal(null, err);
            if (null !== err)
               done(err);
            else if (result.length > 0)
               done(null, result[0]);
            else
               done(null, false);
         }

         app.db.collection(UserModule.db).find(query, options).toArray(cb);
      }
      return new LocalAuthStrategy(authFunc);
   }
};
