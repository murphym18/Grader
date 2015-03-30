var assert = require('assert');

var config = require("./js/config");

var user = require("./js/admin/user");
var role = require("./js/admin/role");

var sockIo = require('socket.io');
var http = require('http');

var io;
var app = require("./routes/index");
var mongo = require('mongodb');

mongo.MongoClient.connect(config.db.url, dbConnected);

function dbConnected(err, database) {
   assert.equal(null, err);
   app.db = database;
   app.mkId = function(str) {
      var o_id = mongo.ObjectID.createFromHexString(str);
      return o_id;
   }
   setupHttp();
}

function setupHttp() {
   var server = http.createServer(app).listen(config.http.port);
   io = sockIo.listen(server);
   io.on('connection', function(socket){
      console.log('a user connected');
      socket.on('disconnect', function(){
         console.log('user disconnected');
      });
   });
}


