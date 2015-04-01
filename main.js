

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
   for (var sections in routes) {
      var mount = '/' + sections;
      global.app.all([mount, mount + '/*'], isAuthenticated);
      global.app.use(mount, routes[sections]);
   }
});

appEvent.on('ready', function() {
   console.log('app ready')
});




