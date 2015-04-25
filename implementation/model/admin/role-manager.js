/** @author Michael Murphy */
var utils = require.main.require('./app/util');
var roles = utils.toRichArray(require('./role'));
utils.toRichArray(Array.prototype);

function _isSuperUserRole(role) {
   return role === "ADMIN" || role === "INSTRUCTOR";
}

function _findRoles(self, user) {
   function isMember(role) {
      function isUser(other) {
         return String(other) === user.id;
      }
      return role === "NONE" || self[role].users.some(isUser);
   }
   return roles.filter(isMember);
}

function _findPerms(self, roles) {
   function toPerms(role) {
      return self[role].permissions;
   }
   return roles.flatMap(toPerms).uniq();
}

function _SchemaProps(roles) {
   var self = this;
   roles.forEach(function(role){
      self[role] = {
         permissions: [String],
         users: [{'type': Schema.Types.ObjectId, 'ref': 'User'}]
      };
   });
}

var schema = mongoose.Schema(new _SchemaProps(roles));

schema.method('findAllUsers', function() {
   var self = this;
   function toUsers(role) {
      return self[role].users;
   }
   return roles.flatMap(toUsers).uniq();
});

schema.method('findUsers', function(role) {
   return this[role].users;
});

schema.method('findRoles', function(user) {
   return _findRoles(this, user).sort();
});

schema.method('findUserPermissions', function(user) {
   var userRoles = _findRoles(this, user);
   return _findPerms(this, userRoles);
});

schema.method('findRolePermissions', function(role) {
   return _findPerms(this, [role]);
});

schema.method('isUserPermitted', function(user, perm) {
   var userRoles = _findRoles(this, user);
   if (userRoles.some(_isSuperUserRole)) {
      return true;
   }
   return _findPerms(this, userRoles).indexOf(perm) !== -1;
});

schema.method('grantPermission', function(role, perm) {
   var permissions = this[role].permissions;
   permissions.addToSet(perm);
   permissions.sort(utils.strcmpIgnoreCase);
   return this;
});

schema.method('revokePermission', function(role, perm) {
   this[role].permissions.removeFirstOccurrence(perm);
   return this;
});

schema.method('assignRole', function(role, user) {
   this[role].users.addToSet(user);
   this[role].users.sort();
   return this;
});

schema.method('revokeRole', function(role, user) {
   this[role].users.removeFirstOccurrence(user);
   return this;
});
