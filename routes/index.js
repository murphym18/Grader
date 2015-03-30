var assert = require('assert');
var express = require('express');
var connect = require('connect');
var rest = require(__dirname + '/rest');
var app = express();

rest.forEach(function(o) {
   app.get('/ws' + o.path, o.functionFactory(app));
});

app.get('/x', function(req, res, next) {
   app.db.collection("users").find({}).toArray(function(err, data) {
      assert.equal(null, err);
      res.end(JSON.stringify(data));
   });
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;