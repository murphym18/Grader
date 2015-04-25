/**
@author Michael Murphy
*/
var app = require('./app');
var co = require('co');
var Users = require('./model/admin/user');
var verboseLog = require('./app/util').verboseLog;

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

   app.ready();
});

//todo add routes



