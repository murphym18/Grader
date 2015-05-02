/** @author Michael Murphy */
var mongoose = require('mongoose');
var userFields = require('./user-fields');
var _ = require('underscore');
var sha = require.main.require('./app/util').hashPasswordString;

var schema = mongoose.Schema(userFields, {save: {w:1}});
schema.set('autoIndex', true);

schema.statics.findLogin = function findLogin(user, pass) {
   return this.findOne({username: user, password: sha(pass)});
};

schema.statics.getRestOptions = function getRestOptions() {
   return {
      idProperty: "username"
   };
};

var majors = require('./majors');

schema.statics.randomUserData = function genUsers(names) {
   function mkEmail(username) {
      var email = new Buffer(username.replace(/[^-a-zA-Z0-9_\.]/g, '') + '@calpoly.edu');
      return email.toString('ascii');
   }

   function genStr(all, len) {
      var result = "";
      for (var i = 0; i < len; ++i) {
         result += all.charAt(Math.floor(Math.random() * all.length));
      }
      return result;
   }
   var users = names.map(function(e){
      var tmp = e.split(' ');
      return {first: tmp[0], last: tmp[1]};
   }).map(function(e) {
      e.username = (e.first.charAt(0)+e.last).toLowerCase().replace(/[^a-z0-9]/, '');
      e.password = e.username;
      e.major = majors[Math.floor(Math.random() * majors.length)];
      e.email = mkEmail(e.username);
      e.emplId = genStr('0123456789', 9);
      return e;
   });
   var usernames = {};
   users.forEach(function(u){
      if (usernames[u.username]) {
         usernames[u.username] += 1;
      }
      else {
         usernames[u.username] = 1;
      }
   });

   var duplicates = _.keys(usernames).filter(function(e){return usernames[e] > 1;});
   duplicates.forEach(function(d){
      var i = users.length;
      while (usernames[d] > 1) {
         i--;
         if (users[i].username == d) {
            users[i].username = users[i].username + String(usernames[d] - 1);
            users[i].password = users[i].username;
            users[i].email = mkEmail(users[i].username);
            usernames[d] = usernames[d] - 1;
         }
      }
   });

   return users;
};

module.exports = mongoose.model('User', schema);