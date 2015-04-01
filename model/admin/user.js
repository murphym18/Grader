var IdentitySet = require('./identity').IdentitySet;

function User(first, last) {
   this.first = first;
   this.last = last;
   IdentitySet.call(this);
}

module.exports = User;
