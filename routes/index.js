var fs = require('fs');
var path = require('path');
var express = require('express');

var defaultRoute = express.Router();
defaultRoute.get('/', function(req, res) {
   res.render('index');
});

var routes = {
   '': defaultRoute
};

var files = fs.readdirSync(__dirname).filter(function(file) {
   return file !== 'index.js';
}).filter(function(file) {
   return fs.statSync(path.join(__dirname, file)).isFile();
}).map(function(file) {
   return path.basename(file, '.js');
}).forEach(function(file) {
   var subRoute = require('./' + file);
   routes[file] = subRoute;
});


module.exports = routes;