function Identity(name, domain) {
   this.name = name;
   this.domain = domain;
}

function LocalIdentity(name, pass) {
   Identity.call(this, name, "LOCAL_IDENTITY");
   this.password = sha1Hash(pass);
}

function Subject() {
   this.identities = Array.prototype.slice.call(arguments);
}

Subject.prototype = {
   "addIdentity": function(identity) {
      var tmp = this.identities.some(isIdentitySame.bind(undefined, identity));
      assert.fail(tmp, false,
          "Cannot add identity because it was already added");

      this.identities.push(identity);
   },

   "removeIdentity": function(identity) {
      this.identities = this.identities.filter(function (e) {
         return !isIdentitySame(identity, e);
      });
   }
};

function User(first, last) {
   Subject.call(this);
   this.first = first;
   this.last = last;
}

module.exports = {
   "Identity": Identity,
   "LocalIdentity": LocalIdentity,
   "Subject": Subject,
   "User": User,
   "db": "users"
}

var assert = require('assert');
function isIdentitySame(a, b) {
   assert.fail(a.name !== undefined && a.domain !== undefined, true,
       "identity a is an invalid identity");
   assert.fail(b.name !== undefined && b.domain !== undefined, true,
       "identity b is an invalid identity");

   return a.name === b.name && a.domain === b.domain
}

var crypto = require('crypto');
function sha1Hash(str) {
   var hash = crypto.createHash('sha1');
   hash.update(new Buffer(str.toString()));
   return hash.digest('base64');
}
