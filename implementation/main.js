/** @author Michael Murphy */

var fs = require('fs');
var path = require('path');

var co = require('co');
var Q = require('q');
var _ = require('underscore');

var app = require('./app');
var config = require('./app/config');
var verboseLog = require('./app/util').verboseLog;

var mongoose = require('mongoose');
var Users = require('./model/admin/user');
var Course = require('./model/course/index');

var routes = require('./routes');
var restify = require('express-restify-mongoose');

/**
 *
 */
function * main() {
   yield setupDatabase();

   /* Mount login REST endpoints */
   app.use('/api/', routes.login);
   app.use('/api/', routes["user"]);
   mountRestEndpoints();

   /**
    * This is a hack so that if connects from an external site to path managed by
    * the client side history API the page still works.
    */
   app.use('/',function(req, res, next){
      var sub = req.url.toString().substr(0, 5);
      if (sub !== '/api/' && req.accepts(['html', 'application/json']) === 'html')
         res.sendFile(__dirname + '/public/index.html');
      else{
         next();
      }
   });

   app.ready();
}

function setupDatabase() {
   return co(function * initDatabase() {
      try {
         if (config.db.clearOnStartup) {
            yield clearDatabase();
         }
         if (config.db.generateMockData) {
            var admin = yield Users.findOne({username: 'admin'});
            if (!admin) {
               yield promiseSave(Users, {username: 'admin', password: 'admin'});
            }
            var mockUsers = require('./model/admin/mock-users');
            yield Q.all(mockUsers.map(toSave(Users)));

            var allUsers = yield Users.find().exec();
            admin = yield Users.findOne({username: 'admin'}).exec();
            var mockCourses = require('./model/course/mock-courses');
            yield Q.all(mockCourses(admin, allUsers).map(toSave(Course)));
            verboseLog("Loaded mock data");
         }
      }
      catch (err) {
         console.warn(err);
         console.warn(err.stack);
      }
   });
}

mongoose.connection.once('open', function() {
   co(main).then(function(val){
   }, function (err) {
      console.log("err",err)
      throw err;
   });
});

function promiseSave(Model, obj){
   var doc = new Model(obj);
   return Q.ninvoke(doc, 'save');
}

function toSave(Model) {
   return _.partial(promiseSave, Model);
}

function clearDatabase() {
   return Q.all([
      Course.remove().exec(),
      Users.remove().exec()
   ]);
}

function mountRestEndpoints(){
   var files = scanModelFiles(path.resolve('./model'));
   for (file of files) {
      try{
         if(typeof(file === 'string')){
            verboseLog("Loading module file", file);
            require(file);
         }
      }
      catch(ex){
         console.warn("Skipping file ", file, " due to error: ", ex);
      }
   };

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
         fs.readdirSync(dirname).forEach(function(file) {
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
