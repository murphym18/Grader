/**
@author Michael Murphy
*/
var co = require('co');
var app = require('./app');
var verboseLog = require('./app/util').verboseLog;
var Users = require('./model/admin/user');
var routes = require('./routes');

app.use('/api/', routes.login);

/* add an admin user */
co(function *() {
   try {
      var admin = yield Users.findOne({username: 'admin'}).exec();
      if (!admin) {
         console.log('Creating admin')
         yield Users.create({username: 'admin', password: 'admin'})
      }
      admin = yield Users.findOne({username: 'admin'}).exec();
      verboseLog(admin);
   } catch (err) {
      console.err(err);
      console.err(err.stack);
   }

   var defaultCourseRoles = [
      "INSTRUCTOR",
      "TEACHER_ASSISTANT",
      "STUDENT",
      "NONE"
   ];
   var defaultSystemRoles = [
      "ADMIN",
      "NONE"
   ];

   app.ready();
});




