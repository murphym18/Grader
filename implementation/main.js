/** @author Michael Murphy */

var co = require('co');
var fs = require('fs');
var app = require('./app');
var verboseLog = require('./app/util').verboseLog;
var Users = require('./model/admin/user');
var routes = require('./routes');

/* mount login REST endpoints */
app.use('/api/', routes.login);

/* Bootstrap Angoose  */
setImmediate(function(){
   require("angoose").init(app, app.angooseOptions);
   /* Cleanup Angoose */
   process.on('SIGINT', function() {
      fs.unlinkSync(app.angooseOptions['client-file']);
      process.exit(0);
   });
});

/* add an admin user */
co(function *() {
   try {
      var admin = yield Users.findOne({username: 'admin'}).exec();
      if (!admin) {
         console.warn('Creating admin')
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





