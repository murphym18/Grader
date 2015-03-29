var Role = (function () {
   function Role(name, id) {
      Object.defineProperty(this, 'ordinal', {
         enumerable: true,
         configurable: false,
         writable: false,
         value: id
      });

      Object.defineProperty(this, 'name', {
         enumerable: true,
         configurable: false,
         writable: false,
         value: name
      });
   }

   var id = 0;

   return {
      Object.defineProperty(this, "ADMIN", {
         enumerable: true,
         configurable: false,
         writable: false,
         value: new Role("ADMIN", id++)
      });

      Object.defineProperty(this, "INSTRUCTOR", {
         enumerable: true,
         configurable: false,
         writable: false,
         value: new Role("INSTRUCTOR", id++)
      });

      Object.defineProperty(this, "TEACHER_ASSISTANT", {
         enumerable: true,
         configurable: false,
         writable: false,
         value: new Role("TEACHER_ASSISTANT", id++)
      });

      Object.defineProperty(this, "STUDENT", {
         enumerable: true,
         configurable: false,
         writable: false,
         value: new Role("STUDENT", id++)
      });

      Object.defineProperty(this, "NONE", {
         enumerable: true,
         configurable: false,
         writable: false,
         value: new Role("NONE", id++)
      });
   };
})();

function Identity(name, domain) {
   this.name = name;
   this.domain = domain;
}

function Subject() {
   this.authenticatedIdentities = [];
}

function User(first, last) {
   this.first = first;
   this.last = last;
}