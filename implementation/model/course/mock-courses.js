var _ = require('underscore');
var MockAssignments = require('./assignment/mock-assignments')();
var COURSE_ABBREVIATION = require('./abbreviations');
var TERMS = ['Winter', 'Spring', 'Summer', 'Fall'];

module.exports = generateMockCourses;
function generateMockCourses(admin, allUsers) {
   var i = 0;
   allUsers = _.shuffle(allUsers);

   function next() {
      return allUsers[i++ % allUsers.length];
   }

   function addUsers(course) {
      for (var w = 0; w < 1; w++) {
         course.roles[0].users.push(allUsers[i++ % allUsers.length]);
      }

      for (var x = 0; x < 2; x++) {
         course.roles[1].users.push(allUsers[i++ % allUsers.length]);
      }

      for (var y = 0; y < 20; y++) {
         var student = allUsers[i++ % allUsers.length];
         course.roles[2].users.push(student);
         course.students.push({user: student});
      }
      return course;
   }
   var arr = new Array(50); arr.fill(0);
   return arr.map(_.partial(generateMockCourse, admin)).map(addUsers)
}

function generateMockCourse(admin) {
   var defaultRoles = [
      {name: "INSTRUCTOR", permissions: [], users: []},
      {name: "TEACHER_ASSISTANT", permissions: [], users: []},
      {name: "STUDENT", permissions: [], users: []},
      {name: "NONE", permissions: [], users: [admin.id]}
   ];

   function genStr(all, len) {
      var result = "";
      for (var i = 0; i < len; ++i) {
         result += all.charAt(Math.floor(Math.random() * all.length));
      }
      return result;
   }
   function COURSE_CODE_GENERATOR() {
      return COURSE_ABBREVIATION[Math.floor(Math.random() * COURSE_ABBREVIATION.length)];
   }
   function COURSE_NUMBER_GENERATOR() {
      return genStr('12345',1) + genStr('1234567890', 2);
   }
   function COURSE_SECTION_GENERATOR() {
      var all = '0123456789';
      var result = all.charAt(Math.floor(Math.random() * (all.length-1))+1);
      return result;
   }
   function genDates(term, year) {
      function date(m1, d1, m2, d2) {
         return {start: new Date(year, m1, d1), end: new Date(year, m2, d2)}
      }
      return {
         'Winter': date(0, 5, 2, 20),
         'Spring': date(2, 30, 5, 12),
         'Summer': date(5, 19, 7, 29),
         'Fall': date(8, 22, 11, 12)
      }[term];
   }

   var result = {
      classCode: COURSE_CODE_GENERATOR(),
      classNumber: COURSE_NUMBER_GENERATOR(),
      section: COURSE_SECTION_GENERATOR(),
      roles: defaultRoles,
      term: TERMS[Math.floor(Math.random() * TERMS.length)],
      year: 2014 + Math.ceil(Math.random() * 3),
      categories: MockAssignments,
      students: []
   };
   _.extend(result, genDates(result.term, Number(result.year)));
   result.colloquialUrl =  result.classCode + "-" + result.classNumber + "-" + result.section + "-" + result.term + result.year;

   return result;
}