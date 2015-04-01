global.startHttp = function() {
   var server = http.createServer(app).listen(config.http.port);
   io = sockIo.listen(server);
   io.on('connection', function(socket){
      console.log('a user connected');
      socket.on('disconnect', function(){
         console.log('user disconnected');
      });
   });
};

var crypto = require('crypto');
global.passHash = function(str) {
   var hash = crypto.createHash('sha256');
   hash.update(new Buffer(str.toString()));
   return hash.digest('base64');
}

var appEvent = require('./app');
appEvent.on('routers', function() {
   var routes = require('./routes');
   for (var sections in routes) {
      global.app.use('/' + sections , routes[sections]);
   }
});

appEvent.on('ready', function() {
   console.log('app ready')
});




