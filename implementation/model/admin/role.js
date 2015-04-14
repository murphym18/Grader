/**
@author Michael Murphy
*/
/**
 * A Role is assigned to a User, and it authorizes that User to do stuff.
 */

/*
In JavaScript, there are no built-in enum types. This code emulates enums.

It creates a read only object (constructed by RoleEnum) with the properties
(constructed by Role) for each enum value in our java model.
 */

module.exports = (function () {
   var roleTypes = [
      "ADMIN",
      "INSTRUCTOR",
      "TEACHER_ASSISTANT",
      "STUDENT",
      "NONE"
   ];

   function Role(name, id) {
      Object.defineProperty(this, "ordinal", {
         enumerable: true,
         configurable: false,
         writable: false,
         value: id
      });

      Object.defineProperty(this, "name", {
         enumerable: true,
         configurable: false,
         writable: false,
         value: name
      });
   }

   function RoleEnum() {
      for (var id = 0; id < roleTypes.length; ++id) {
         Object.defineProperty(this, roleTypes[id], {
            enumerable: true,
            configurable: false,
            writable: false,
            value: new Role(roleTypes[id], id)
         })
      }
   }
   var roles = new RoleEnum();
   Object.freeze(roles);

   return roles;
})();
