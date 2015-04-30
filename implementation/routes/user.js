/** @author Michael Murphy */
var router = require('express').Router();
var co = require('co');
var mongoose = require('mongoose');
var Courses = require.main.require('./model/course/course');
var Users = require.main.require('./model/admin/user');
var errorResponse = require.main.require('./app/errors')["500"];
var _ = require('underscore');

router.get('/Users/:username/courses', function(req, res, next) {
   co(function *() {
      try{
         var user = yield Users.findOne({username: req.params.username}).exec();
         if (!user) {
            return res.json([]);
         }

         function containsUser(course) {
            return course.findAllUserIds().indexOf(user.id) != -1;
         }
         var allCourses = yield Courses.find({}).exec();
         var data = allCourses.filter(containsUser)
         res.json(data);
      }
      catch(err) {
         errorResponse(err, req, res, next);
      }
   });
});

module.exports = router;