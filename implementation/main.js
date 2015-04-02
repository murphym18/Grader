var config = require('./app/config');
var boot = require('./app');
var http = require('http');

boot.on('routers', function(app) {
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


      global.db.collection("users").find(query, {}).toArray(checkLogin);


      res.redirect('/')
   });
   for (var sections in routes) {
      var mount = '/' + sections;
      app.all([mount, mount + '/*'], isAuthenticated);
      app.use(mount, routes[sections]);
   }
});

boot.on('ready', function(app) {
   setImmediate(function(){
      global.server = http.createServer(app).listen(config.http.port);
      console.log('app ready');
   });
});




