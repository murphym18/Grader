function Identity(name, domain) {
   this.name = name;
   this.domain = domain;
}
IdentityHelpers.call(Identity);

function LocalIdentity(name, securePassHash) {
   Identity.call(this, name, "LOCAL_IDENTITY");
   this.securePassHash = securePassHash;
}
IdentityHelpers.call(LocalIdentity);

function IdentityHelpers() {
   var _that = this;

   this.isValid = function(obj) {
      return obj && obj.name !== undefined && obj.domain !== undefined;
   };

   this.isSame = function (a, b) {
      if (!_that.isValid(a))
         throw "identity a is invalid";
      if (!_that.isValid(b))
         throw "identity b is invalid";

      return a.name === b.name && a.domain === b.domain
   };
}

function IdentitySet() {
   this.identities = Array.prototype.slice.call(arguments);
}

IdentitySet.prototype = {
   "addIdentity": function(identity) {
      if (this.identities.some(Identity.isSame.bind(undefined, identity)))
         throw "identity was already added";

      this.identities.push(identity);
   },
   "removeIdentity": function(identity) {
      this.identities = this.identities.filter(function (e) {
         return !Identity.isSame(identity, e);
      });
   }
};

module.exports = {
   "Identity": Identity,
   "LocalIdentity": LocalIdentity,
   "IdentityHelpers": IdentityHelpers,
   "IdentitySet": IdentitySet
};
