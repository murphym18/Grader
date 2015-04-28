/**
@author Michael Murphy
*/
console.time("Database ready");
var _ = require('underscore');
var config = require('./config');
var util = require('./util');
var verboseLog = util.verboseLog;
if (process.argv.indexOf("--mongo") == -1) {
   verboseLog("Using an embedded database.");
   require('tungus');
   // Tungus uses this object to define the TingoDB configuration options.
   global.TUNGUS_DB_OPTIONS = {
      memStore: config.db.memStore,
      searchInArray: true,
      nativeObjectID: false
   };
}
var mongoose = require('mongoose');
var fs = require('fs');



if (process.argv.indexOf("--mongo") != -1) {
   verboseLog("Using MongoDB for database.");
   mongoose.connect(config.db.mongoUrl);
}
else {
   var absPath = setupDatabaseDirectory();
   mongoose.connect('tingodb://'.concat(absPath));
}
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
