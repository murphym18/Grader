var events = require("events");
var mongo = require('mongodb');
var config = require('./config');
var assert = require('assert');

var EventEmitter = events.EventEmitter;
module.exports = new EventEmitter();

mongo.MongoClient.connect(config.db.url, function (err, database) {
   assert.equal(null, err);
   DatabaseHelpers.call(database);
   global.db = database;
   module.exports.emit('ready');
});

function DatabaseHelpers() {
   var _that = this;
   this.createId = function(hexStr) {
      return mongo.ObjectID.createFromHexString(str);
   };
   this.findById = function(type, mongoId, cb) {
      global.db.collection(type).find({ "_id": id }, {}).toArray(function(err, result){
         if (err)
            cb(err, null);
         else if (result.length > 0)
            cb(null, result[0]);
         else
            cb(null, false);
      });
   };
   this.collection('users', {}, function(err, collection) {
      _that.users = CollectionHelpers.call(collection);
   });
}

function CollectionHelpers() {
   var _that = this;
   this.findId = function(mongoId, cb) {
      this.find({ "_id": id }, {}).toArray(function(err, result){
         if (err)
            cb(err, null);
         else if (result.length > 0)
            cb(null, result[0]);
         else
            cb(null, false);
      });
   }

   this.findAll = function(){
      this.find({}, {}).toArray(function(err, result){
      if (err)
         cb(err, null);
      else if (result.length > 0)
         cb(null, result);
      else
         cb(null, false);
   })};
}