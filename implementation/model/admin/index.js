var identity = require('./identity');
var Role = require('./role');
var User = require('./user');

function createUser(first, last, done) {
   global.db.collection('users').insert(new User(first, last), done)
}

module.exports = {
   "Identity": identity.Identity,
   "LocalIdentity": identity.LocalIdentity,
   "IdentityHelpers": identity.IdentityHelpers,
   "IdentitySet": identity.IdentitySet,
   "Role": Role,
   "User": User,
   "createUser": createUser
};
