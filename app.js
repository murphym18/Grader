var assert = require('assert');

var config = require("./js/config");
var user = require("./js/admin/user");
var role = require("./js/admin/role");

var http = require('http');
var mongo = require('mongodb');
var app = require("./routes/index");

mongo.MongoClient.connect(config.db.url, onDbConnected);

function onDbConnected(err, database) {
   assert.equal(null, err);
   app.db = database;
   app.mkId = function(str) {
      var o_id = mongo.ObjectID.createFromHexString(str);
      return o_id;
   }
   startApp();
}

function startApp() {
   http.createServer(app).listen(config.http.port);
}





