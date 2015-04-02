/**
 * Security related helper functions
 * @type {exports}
 */
var crypto = require('crypto');

module.exports = {
    passHash: function(str) {
       var hash = crypto.createHash('sha256');
       hash.update(new Buffer(str.toString()));
       return hash.digest('base64');
    }
}