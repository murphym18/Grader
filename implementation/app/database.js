/**
@author Michael Murphy
*/
console.time("Database ready");
var _ = require('underscore');
require('tungus');
var mongoose = require('mongoose');
var config = require('./config');
var fs = require('fs');

/* patch angoose.js */
var search = [[
   "files.push(path.resolve( __dirname ,",
   " '../models/SampleUser.js')); // sample model"
].join(''),'res.send(200, data);','logger.error("No angular")'];
var file = [
   __dirname + '/../node_modules/angoose/lib/angoose.js',
   'node_modules/angoose/lib/Pipeline.js',
   __dirname + '/../node_modules/angoose/lib/client/angoose-angular.js'
];
var replace = [
    "",
    'res.status(200).send(data)',
    'logger.info("No angular")'
];
var patchParams = _.zip(file, search, replace);
patchParams.forEach(function(arr){
   function patchFile(file, search, replace) {
      replace = replace ? replace : "";
      var body = fs.readFileSync(file).toString();
      var idx = body.indexOf(search);

      if (idx >= 0 ) {
         var output = body.substr(0, idx) + replace + body.substr(idx + search.length);
         fs.writeFileSync(file, output);
      }
   }
   patchFile.apply(null, arr);
});


// Tungus uses this object to define the TingoDB configuration options.
global.TUNGUS_DB_OPTIONS = {
   memStore: config.db.memStore,
   searchInArray: true,
   nativeObjectID: false
};

var absPath = setupDatabaseDirectory();
mongoose.connect('tingodb://'.concat(absPath));
mongoose.connection.once('open', function() {
   console.timeEnd("Database ready");
});



module.exports = mongoose;

/**
 * If the database directory doesn't exist and the flag to create missing
 * directories is on, then this function creates the database directory.
 */
function setupDatabaseDirectory() {
   var fs = require('fs');
   var path = require('path');
   var util = require('./util');

   var absPath = path.resolve(config.db.path);
   if (config.createMissingDirectories && !fs.existsSync(absPath)) {
      console.warn("Creating directory for database files: \"" + absPath + "\"");
      util.makeDirectoryPlusParents(absPath);
   }
   return absPath;
}
