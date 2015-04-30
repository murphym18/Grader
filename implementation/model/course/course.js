/** @author Michael Murphy */

var mongoose = require('mongoose');
var schema = require('../admin/role-manager');
var _ = require('underscore')

schema.add({
   classNumber: {
      type: String,
      match: /[1-5]\d{2}/
   },
   classCode: {
      type: String,
      enum: ["AERO","AGB","AEPS","AGC","AGED","AG","ASCI","ANT","ARCE","ARCH","ART","ASTR","BIO","BMED","BRAE","BOT","BUS","CHEM","CD","CHIN","CRP","CE","COMS","CPE","CSC","CM","DSCI","DANC","DATA","DMHS","ESE","ESM","ERSC","ECON","EDUC","EE","ENGR","ENGL","EDES","ENVE","ES","FPE","FSN","FR","GEOG","GEOL","GER","GS","GSA","GSB","GSE","GRC","HIST","HNRC","HNRS","IME","IT","ISLA","IS","ITAL","JPNS","JOUR","KINE","LA","LAES","LS","MSCI","MATE","MATH","ME","MCRO","MSL","MLL","MU","NR","PHIL","PEM","PEW","PSC","PHYS","POLS","PSY","RPTA","RELS","SCM","SOCS","SOC","SS","SPAN","STAT","SIE","TH","UNIV","WVIT","WGS","ZOO"]
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
      enum: ['Winter', 'Spring', 'Summer', 'Fall'],
      required: true,
      "default": getTermByMonth
   },
   coursePath: {
      type: String,
      index: {
         unique: true
      },
      required: true,
      select: true,
      match: /[A-Z][-A-Z0-9]*/
   }
});
schema.index({ coursePath: 1, term: 1, year: -1});
schema.set('autoIndex', false);


function getTermByMonth(month) {
   var legend = [
      {'Winter': [12, 1, 2]},
      {'Spring': [3,4,5]},
      {'Summer': [6,7,8]},
      {'Fall': [9,10,11]}
   ];
   var m = month || (new Date()).getMonth() + 1;
   var result = legend.filter(function(e){
      return e[_.keys(e)[0]].indexOf(m) != -1;
   });
   return _.keys(result[0])[_.keys(result)[0]].toString();
}

function mkCourse(admin) {
   var defaultRoles = [
      {name: "INSTRUCTOR", permissions: [], users: [admin]},
      {name: "TEACHER_ASSISTANT", permissions: [], users: [admin]},
      {name: "STUDENT", permissions: [], users: [admin]},
      {name: "NONE", permissions: [], users: [admin]}
   ];
   var codes = ["AERO","AGB","AEPS","AGC","AGED","AG","ASCI","ANT","ARCE","ARCH","ART","ASTR","BIO","BMED","BRAE","BOT","BUS","CHEM","CD","CHIN","CRP","CE","COMS","CPE","CSC","CM","DSCI","DANC","DATA","DMHS","ESE","ESM","ERSC","ECON","EDUC","EE","ENGR","ENGL","EDES","ENVE","ES","FPE","FSN","FR","GEOG","GEOL","GER","GS","GSA","GSB","GSE","GRC","HIST","HNRC","HNRS","IME","IT","ISLA","IS","ITAL","JPNS","JOUR","KINE","LA","LAES","LS","MSCI","MATE","MATH","ME","MCRO","MSL","MLL","MU","NR","PHIL","PEM","PEW","PSC","PHYS","POLS","PSY","RPTA","RELS","SCM","SOCS","SOC","SS","SPAN","STAT","SIE","TH","UNIV","WVIT","WGS","ZOO"];
   function genStr(all, len) {
      var result = "";
      for (var i = 0; i < len; ++i) {
         result += all.charAt(Math.floor(Math.random() * all.length));
      }
      return result;
   }
   function COURSE_CODE_GENERATOR() {
      return codes[Math.floor(Math.random() * codes.length)];
   }
   function COURSE_NUMBER_GENERATOR() {
      return genStr('12345',1) + genStr('1234567890', 2);
      //var all = '0123456789';
      //var result = all.charAt(Math.floor(Math.random() * (all.length-1))+1);
      //for (var i = 0; i < 2; ++i) {
      //   result += all.charAt(Math.floor(Math.random() * all.length));
      //}
      //return result;
   }
   function COURSE_SECTION_GENERATOR() {
      var all = '0123456789';
      var result = all.charAt(Math.floor(Math.random() * (all.length-1))+1);
      return result;
   }
   var result = {
      classCode: COURSE_CODE_GENERATOR(),
      classNumber: COURSE_NUMBER_GENERATOR(),
      section: COURSE_SECTION_GENERATOR(),
      //start: new Date(2015, 3, 30),
      //end: new Date(2015, 6, 14),
      roles: defaultRoles,
      term: getTermByMonth(Math.ceil(Math.random() * 12)),
      year: 2015 + Math.ceil(Math.random() * 9)
   };
   result.coursePath =  result.classCode + "-" + result.classNumber + "-" + result.section + "-" + result.term + result.year;
   return result;
}

schema.statics.getTermByMonth = getTermByMonth;
schema.statics.getRestOptions = function() {
   return {idProperty: "coursePath"};
}
schema.statics.makeRandomCourse = mkCourse;

module.exports = mongoose.model('Course', schema);