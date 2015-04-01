

var crypto = require('crypto');
global.passHash = function(str) {
   var hash = crypto.createHash('sha256');
   hash.update(new Buffer(str.toString()));
   return hash.digest('base64');
}

var appEvent = require('./app');
appEvent.on('routers', function() {
   var routes = require('./routes');
   var isAuthenticated = function (req, res, next) {

      if (req.isAuthenticated()){
         console.log(req.user);
         res.locals.user = req.user;
         return next();
      }

      else {
         req.session.goto = req.originalUrl;
         res.redirect('/login');
      }

   }
   var admin = require('./model/admin');
   app.get('/setup', function(req, res) {
      res.render('setup');
   });

   app.post('/setup', function(req, res, next) {
      var username = req.body.username;
      var pass = passHash(req.body.password);
      var identity =  new admin.LocalIdentity(username, pass);
      var query = {
         "identities": identity
      };

      function checkLogin(err, res){
         if (res.length > 0)
            next(new Error("Username Taken"));
         else {
            admin.createUser(req.body.first, req.body.last, function (err, result) {
               var query = { _id: result.ops[0]._id };
               var change = { $push: {"identities": identity}};
               global.db.collection('users').update(query, change, function(err, result){
                  console.log(result);
               });
            });
         }
      }
      global.db.collection("users").find(query, {}).toArray(checkLogin);


      res.redirect('/')
   });
   for (var sections in routes) {
      var mount = '/' + sections;
      global.app.all([mount, mount + '/*'], isAuthenticated);
      global.app.use(mount, routes[sections]);
   }
});

appEvent.on('ready', function() {
   console.log('app ready')
});




