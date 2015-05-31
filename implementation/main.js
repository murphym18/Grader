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
var Student = require('./model/course/student');

var routes = require('./routes');
var restify = require('express-restify-mongoose');
var SegfaultHandler = require('segfault-handler');

SegfaultHandler.registerHandler();
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
   app.get(/^\/courses.?/, function(req, res, next){
      res.sendFile(__dirname + '/public/index.html');
      // if(req.accepts(['html', 'application/json']) !== 'html') {
      //    return next();
      // }
      
      // var path = req.url.toString();   
      // if (path.substr(0, 5) !== '/api/' && )
         
      // else {
      //    next();
      // }
   });

   app.ready();
}



function setupDatabase() {
   // A co routine takes a generator function that yields promises. These are
   // great because many co routines can be running concurrently!
   
   return co(function * initDatabase() {
      // We can use try and catch instead of a node-style-callback
      try {
         if (config.db.clearOnStartup) {
            // Clearing the database requires IO.
            // The Node.js framework typically hides IO behind callbacks
            // The clearDatabase function returns a promise instead!
            // When the promise resolves without then error execution continues.
            // When the promise resolves in an error the co routine causes an 
            // an exception to be thrown and execution jumps to the catch block.
            yield clearDatabase();
         }
         if (config.db.generateMockData) {
            // The Mongoose lib returns promises so it fits perfectly here.
            var admin = yield Users.findOne({username: 'admin'});
            if (!admin) {
               // Originally I named promiseSave() promiseToSave() but it caused
               // this line to be longer than 80 characters so I gave it this
               //tarser name.
               yield promiseSave(Users, {username: 'admin', password: 'admin'});
            }
            var mockUsers = require('./model/admin/mock-users');
            // The Q lib is awesome! Here the `all` method is used to change an 
            // array of promises into a single promise that resolves when every
            // promise in the array has resolved. This line of code starts the
            // IO that saves all the users in the mockUsers array and blocks
            // until all users are saved.
            yield Q.all(mockUsers.map(toSave(Users)));
            
            // Now that all the users have been created, it time to load them.
            // Doing a query like this is kinda hacky but this code is much
            // easier to understand. The less readable alternative is to map the
            // documents returned in the promises from the last line. The
            // problem with that approach is that the promises return a data
            //structure containing the document.
            var allUsers = yield Users.find().exec();
            
            // Also load the admin user
            admin = yield Users.findOne({username: 'admin'}).exec();
            
            // Grab the function that makes mock-courses
            var mockCourses = require('./model/course/mock-courses');
            
            var studentDocs = [];
            // Make mock courses and save them to the Course collection
            yield Q.all(mockCourses(admin, allUsers).map(function(course){
               var students = course.students;
               delete course.students;
               studentDocs.push(students);
               var doc = new Course(course);
               return Q.ninvoke(doc, 'save');
            }));
            var pojso = _.flatten(studentDocs).map(function (student) {
               student.grades = '';
               return student;
            });
            
            yield Student.create(pojso);//toSave(Course)));
            //yield Student.create(studentDocs)
            // yield Q.all(studentDocs.map(function(data){
            //    var doc = new Student(data);
            //    return Q.ninvoke(doc, 'save');
            // }));
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
      Users.remove().exec(),
      Student.remove().exec()
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
