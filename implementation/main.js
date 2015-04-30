/** @author Michael Murphy */

var co = require('co');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var app = require('./app');
var verboseLog = require('./app/util').verboseLog;
var Users = require('./model/admin/user');
var Course = require('./model/course/course');
var routes = require('./routes');
var mongoose = require('mongoose');
var restify = require('express-restify-mongoose');

/* Mount login REST endpoints */
app.use('/api/', routes.login);
app.use('/api/', routes["user"]);

mountModel();

/**
 * This is a hack so that if connects from an external site to path managed by
 * the client side history API the page still works.
 */
app.use('/', function(req, res, next){
   var sub = req.url.toString().substr(0, 5);
   if (sub !== '/api/' && req.accepts(['html', 'application/json']) === 'html')
      res.sendFile(__dirname + '/public/index.html');
   else{
      next();
   }
});

//console.log(mkCourse());

co(function *() {
   try {
      var admin = yield Users.findOne({username: 'admin'}).exec();
      if (!admin) {
         console.warn('Creating admin user');
         yield Users.create({username: 'admin', password: 'admin'});
      }
      admin = yield Users.findOne({username: 'admin'}).exec();
      yield Course.remove().exec();
      var num = yield Course.count().exec();
      if (num < 1) {
         _.map(_.range(25), function() {
            return Course.makeRandomCourse(admin);
         }).forEach(function(c){
            Course.create(c, function(err, c) { if (err) throw err; });
         });
      }
   } catch (err) {
      console.err(err);
      console.err(err.stack);
   }
   app.ready();
});


function mountModel(){
   function scanModelFiles(dirs){
      var dirs = _.isArray(dirs)? dirs: [dirs];
      var files = [];

      function scanDir(dirname){
         if(!dirname ||   dirname.indexOf("node_modules")>=0) return;
         verboseLog("Scanning directory for modules: ", dirname);
         if(fs.existsSync(path.resolve(dirname, 'index.js'))){
            files.push(path.resolve(dirname, 'index.js') );
            return;
         }
         fs.readdirSync( dirname  ).forEach(function(file) {
            var fullpath = path.resolve(dirname,file);
            if(! fs.statSync(fullpath).isFile()) scanDir( fullpath );
            else if (file.match(/.+\.js/g) !== null) {
               files.push(fullpath);
            }
         });
      }
      dirs.forEach(function(dirname){
         scanDir(dirname);
      });
      return files;
   }

   var files = scanModelFiles(path.resolve('./model'));
   files.forEach(function(file) {
      try{
         if(typeof(file === 'string')){
            verboseLog("Loading module file", file);
            require(file);
         }
      }
      catch(ex){
         console.warn("Skipping file ", file, " due to error: ", ex);
      }
   });
   verboseLog("Adding all mongoose models");
   _.each(mongoose.modelNames(), function(modelName){
      var model = mongoose.models[modelName];
      var options = _.extend({
         version: ''
      }, model.getRestOptions ? model.getRestOptions(): {});
      if (modelName === "User") {

      }
      restify.serve(app, model, options);
   });
};