/** @author Michael Murphy */

var co = require('co');
var async = require('async');
var Q = require('q');
var Promise = require('mpromise');
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
var Category = require('./model/course/assignment/category');
var categoryNames = (function*(arr) {
   while(1)
      yield arr[Math.floor(Math.random() * arr.length)];
})(require('./model/course/assignment/moch-names'))


/* Mount login REST endpoints */
app.use('/api/', routes.login);
app.use('/api/', routes["user"]);
app.use('/api/', routes["assignments"]);

mountRestEndpoints();

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

var names = ["Aidan Gillen","Alfie Allen","Amrita Acharia","Art Parkinson","Arya Stark","Ben Crompton","Ben Hawkey","Bran Stark","Catelyn Stark","Cersei Lannister","Charles Dance","Ciaran Hinds","Conleth Hill","Daario Naharis","Daenerys Targaryen","Daniel Portman","Davos Seaworth","Dean-Charles Chapman","Diana Rigg","Dominic Carter","Donald Sumpter","Eddard Stark","Ellaria Sand","Emilia Clarke","Esme Bianco","Eugene Simon","Finn Jones","Gwendoline Christie","Hannah Murray","Harry Lloyd","Iain Glen","Ian Beattie","Ian McElhinney","Indira Varma","Isaac Hempstead-Wright","Iwan Rheon","Jack Gleeson","Jacob Anderson","Jaime Lannister","James Cosmo","Jaqen H'ghar","Jason Momoa","Jeor Mormont","Jerome Flynn","Joe Dempsie","Joffrey Baratheon","John Bradley","Jon Snow","Jonathan Pryce","Jorah Mormont","Josef Altin","Julian Glover","Khal Drogo","Kit Harington","Kristian Nairn","Kristofer Hivju","Lena Headey","Liam Cunningham","Maisie Williams","Margaery Tyrell","Mark Addy","Michael McElhatton","Michelle Fairley","Michiel Huisman","Natalia Tena","Natalie Dormer","Nathalie Emmanuel","Nikolaj Coster-Waldau","Olenna Tyrell","Oona Chaplin","Owen Teale","Pedro Pascal","Peter Dinklage","Petyr Baelish","Ramsay Bolton","Richard Madden","Robb Stark","Robert Baratheon","Ron Donachie","Roose Bolton","Rory McCann","Rose Leslie","Roxanne McKee","Roy Dotrice","Samwell Tarly","Sandor Clegane","Sansa Stark","Sean Bean","Sibel Kekilli","Sophie Turner","Stannis Baratheon","Stephen Dillane","Talisa Stark","Theon Greyjoy","Thomas Brodie-Sangster","Tom Wlaschiha","Tommen Baratheon","Tormund Giantsbane","Tyrion Lannister","Tyrion Lannister", "Tytos Lannister", "Tywin Lannister", "Viserys Targaryen"];



function genAssignments(categoryName) {
   var assignments = [], numAssignments = Math.ceil(Math.random()*8);
   while(numAssignments > 0) {
      assignments.unshift({name: categoryName +" Assignment "+ String(numAssignments--)});
   }
   return assignments;
}

function mkAssignmentCategory(parentPath) {
   var name = categoryNames.next().value;
   return {
      name: name,
      weight: 1,
      assignments: genAssignments(name),
      path: parentPath ? parentPath.path+"/"+name : name
   };
}


mongoose.connection.once('open',function() {
   co(function *() {
      try {
         yield Course.remove().exec();
         yield Users.remove().exec();
         yield Users.create({username: 'admin', password: 'admin'});
         yield Q.all(Users.randomUserData(names).map(toSave(Users)));
         var admin = yield Users.find({username: 'admin'}).exec();
         var users = _.shuffle(yield Users.find().exec());
         for (var i = 0; i < 200; ++i)
            yield toSave(Course)(generateCourses(admin, users));
         var courses = yield Course.find({}).exec();
         for (var i = 0; i < courses.length; i++) {
            var arr = [];
            for (var j = 0, numToGen = Math.ceil(Math.random() * 3 + 2); j < numToGen; j++) {
               var course = courses[i];
               var c1 = mkAssignmentCategory(false);
               course.categories.push(c1);
               yield Q.ninvoke(course, 'save');
               for (var k = 0, numToGen = Math.ceil(Math.random() * 3 + 2); k < numToGen; k++) {
                  var c2 = mkAssignmentCategory(c1);
                  course.categories.push(c2);
                  yield Q.ninvoke(course, 'save');
                  for (var m = 0, numToGen = Math.ceil(Math.random() * 3 + 2); m < numToGen; m++) {
                     var c3 = mkAssignmentCategory(c2);
                     course.categories.push(c3);
                     yield Q.ninvoke(course, 'save');

                  }
               }
            }
         }
      }
      catch(e) {
         console.dir(e)
         console.log(e.stack);

      }

      //console.log(courses);
      //var newCourses =

      /*

       var c1 = mkAssignmentCategory(courses[i]);
       var numToGen2 = Math.ceil(Math.random() * 6 + 2);
       for (var k = 0; k < numToGen2; k++) {
       var c2 = yield mkAssignmentCategory(c1);
       var numToGen3 = Math.ceil(Math.random() * 6 + 2);
       for (var k = 0; k < numToGen3; k++) {
       var c3 = yield mkAssignmentCategory(c2);
       }
       }

       break;

       */



      return "done"
   }).then(function(val){
      console.log("done",val);
      app.ready();
   }, function (err) {
      console.log("err",err)
      throw err;
   });
});

function promiseSave(model, obj){
   var doc = new model(obj);
   return Q.ninvoke(doc, 'save');
}

function toSave(model) {
   return _.partial(promiseSave, model);
}

function generateCourses(admin, allUsers) {
   function addUsers(course) {
      var j = 0;
      for(var i = 0; i < 1;i++) {
         course.roles[0].users.push(allUsers[j++ % allUsers.length]);
      }

      for(var i = 0; i < 2;i++) {
         course.roles[1].users.push(allUsers[j++ % allUsers.length]);
      }

      course.students = [];
      for(var i = 0; i < 20;i++) {
         var student = allUsers[j++ % allUsers.length];
         course.roles[2].users.push(student);
         course.students.push({user: student});
      }
      return course;
   }
   return addUsers(Course.generateRandomCourse(admin));
}





function mountRestEndpoints(){
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
