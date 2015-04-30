/** @author Michael Murphy */

var mongoose = require('mongoose');
var schema = require('../admin/role-manager');
var _ = require('underscore');
var grades = require('./grade-schema');
var COURSE_ABBREVIATION = require('./abbreviations');
var TERMS = ['Winter', 'Spring', 'Summer', 'Fall'];

schema.add({
   classNumber: {
      type: String,
      match: /[1-5]\d{2}/
   },
   classCode: {
      type: String,
      enum: COURSE_ABBREVIATION
   },
   section: {
      type: String,
      match: /\d+/
   },
   start: Date,
   end: Date,
   year: {
      type: String,
      required: true,
      "default": function(){
         return (new Date()).getFullYear().toString();
      },
      match: /\d{4}/
   },
   term: {
      type: String,
      enum: TERMS,
      required: true,
      "default": getTermByMonth
   },
   colloquialUrl: {
      type: String,
      index: {
         unique: true
      },
      required: true,
      select: true,
      match: /[A-Z][-A-Z0-9]*/
   }
});
schema.add(grades.letterGrade);
schema.add(grades.creditNoCredit);
schema.index({ coursePath: 1, term: 1, year: -1});
schema.set('autoIndex', false);
schema.pre('save', grades.preSave);
schema.statics.getTermByMonth = getTermByMonth;
schema.statics.getRestOptions = getRestOptions;
schema.statics.makeRandomCourse = generateRandomCourse;

module.exports = mongoose.model('Course', schema);

function getRestOptions() {
   return {idProperty: "colloquialUrl"};
}

function getTermByMonth(month) {
   var legend = [
      {'Winter': [12, 1, 2]},
      {'Spring': [3,4,5]},
      {'Summer': [6,7,8]},
      {'Fall': [9,10,11]}
   ];
   var m = month || (new Date()).getMonth() + 1;
   var result = legend.filter(function(e){
      return _.values(e)[0].indexOf(m) != -1;
   }).map(function(val){
      return _.keys(val)[0];
   });
   return result[0].toString();
}

function generateRandomCourse(admin) {
   var defaultRoles = [
      {name: "INSTRUCTOR", permissions: [], users: []},
      {name: "TEACHER_ASSISTANT", permissions: [], users: []},
      {name: "STUDENT", permissions: [], users: []},
      {name: "NONE", permissions: [], users: [admin]}
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
      year: 2014 + Math.ceil(Math.random() * 3)
   };
   _.extend(result, genDates(result.term, Number(result.year)));
   result.colloquialUrl =  result.classCode + "-" + result.classNumber + "-" + result.section + "-" + result.term + result.year;
   return result;
}