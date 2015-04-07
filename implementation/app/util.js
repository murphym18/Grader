var crypto = require('crypto');
var path = require('path');
var fs = require('fs');

exports.hashPasswordString = function(str) {
   var hash = crypto.createHash('sha256');
   hash.update(new Buffer(str.toString()));
   return hash.digest('hex');
}

exports.makeDirectoryPlusParents = function makeDirectoryPlusParents(somePath) {
   var absPath = path.resolve(somePath);
   if (!fs.existsSync(absPath)) {
      try {
         make(absPath);
      }
      catch (err) {
         if (err.rootMissing) {
            var MissingPathRootError = new Error("Cannot create '".concat(
                absPath.concat(
                    "' because path root '".concat(
                        e.rootMissing.concat("' doesn't exists."))
                )
            ));
            throw MissingPathRootError;
         }
         else {
            var CannotMakeDirectory = new Error(err.toString().replace(
                'Error: ', ''));
            throw CannotMakeDirectory;
         }
      }
   }

   function make(dir) {
      if (!fs.existsSync(dir)) {
         var parent = path.dirname(dir);
         if (parent !== dir) {
            make(parent);
         }
         else {
            throw {"rootMissing": parent};
         }
         fs.mkdirSync(dir);
         console.log('made', dir);
      }
   }


}
