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

co(function *() {
   try {
      yield Users.remove().exec();
      var admin = yield Users.findOne({username: 'admin'}).exec();
      if (!admin) {
         console.warn('Creating admin user');
         yield Users.create({username: 'admin', password: 'admin'});
      }
      admin = yield Users.findOne({username: 'admin'}).exec();

      var numUsers = yield Users.count().exec();
      if (numUsers < 2) {
         Users.generateUsers(names).forEach(function(u){
            Users.create(u, function(err) { if (err) console.warn(err);});
         });
      }
      yield Course.remove().exec();
      var allUsers = yield Users.find().exec();
      allUsers = _.shuffle(allUsers);
      var i = 0;
      var num = yield Course.count().exec();
      if (num < 1) {
         _.map(_.range(50), function() {
            return Course.makeRandomCourse(admin);
         }).forEach(function(c){
            c.roles[0].users.push(allUsers[i++ % allUsers.length]);

            c.roles[1].users.push(allUsers[i++ % allUsers.length]);
            c.roles[1].users.push(allUsers[i++ % allUsers.length]);

            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            c.roles[2].users.push(allUsers[i++ % allUsers.length]);
            Course.create(c, function(err) { if (err) console.warn(err); });
         });
      }
   } catch (err) {
      console.err(err);
      console.err(err.stack);
   }
   app.ready();
});

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
