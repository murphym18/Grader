var mongoose = require('mongoose');
require("mongoose-types").loadTypes(mongoose);
var Email = mongoose.SchemaTypes.Email;
var sha = require.main.require('./app/util').hashPasswordString;

var userSchema = mongoose.Schema({
   first: {
      type: String,
      select: true
   },
   last: {
      type: String,
      select: true
   },
   username: {
      type: String,
      index: {
         unique: true
      },
      required: true,
      select: true,
      lowercase: true,
      match: /[a-z0-9]+/
   },
   password: {
      type: String,
      match: /[0-9a-f]{64}/,
      set: sha,
      select: false
   },
   email: {
      type: Email
   },
   major: {
      type: String,
      upper: true
   },
   emplId: {
      type: String,
       match: /[0-9]{9}/,
      unique: true
   }
});
userSchema.set('autoIndex', true);

module.exports = mongoose.model('User', userSchema);
