var app = require('./app');
var co = require('co');
var Users = require('./model/admin/user');

/* add an admin user */
co(function *() {
   try {
      var admin = yield Users.findOne({username: 'admin'}).exec();
      if (!admin) {
         console.log('creating admin')
         yield Users.create({username: 'admin', password: 'admin'})
      }
      admin = yield Users.findOne({username: 'admin'}).exec();
      console.log(admin);
   } catch (err) {
      console.err(err);
      console.err(err.stack);
   }
   app.ready();
});

//todo add routes



