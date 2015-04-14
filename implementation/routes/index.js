/**
@author Michael Murphy
*/
var fs = require('fs');
var path = require('path');
var express = require('express');

module.exports = function (app) {
   var defaultRoute = express.Router();
   defaultRoute.get('', function(req, res) {
      res.render('index');
   });

   var routes = {
      '': defaultRoute
   };

   fs.readdirSync(__dirname).filter(function(file) {
      return file !== 'index.js';
   }).filter(function(file) {
      return fs.statSync(path.join(__dirname, file)).isFile();
   }).map(function(file) {
      return path.basename(file, '.js');
   }).forEach(function(file) {
      var subRoute = require('./' + file)(app);
      routes[file] = subRoute;
   });
   return routes;
}


