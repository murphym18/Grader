/**
@author Michael Murphy
*/
console.time("Database ready");
var _ = require('underscore');
require('tungus');
var mongoose = require('mongoose');
var config = require('./config');
var fs = require('fs');

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
