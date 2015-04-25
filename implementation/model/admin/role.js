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

module.exports = [
   "ADMIN",
   "INSTRUCTOR",
   "TEACHER_ASSISTANT",
   "STUDENT",
   "NONE"
];
