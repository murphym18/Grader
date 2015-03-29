var assert = require('assert');
var config = require("./js/config");
var mongo = require('mongodb').MongoClient;

function Person(first, last) {
   this.first = first;
   this.last = last;
}

console.log(config.db);
MongoClient.connect(config.db.url, function(err, db) {
   assert.equal(null, err);
   console.log("Connected correctly to server");
//  db.collection("people").insert(new Person("Michael", "Murphy"), function(err, r) {
//     assert.equal(null, err);
//     console.log(r);
//     db.close();
//  });

});