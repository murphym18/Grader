define(function (require) {
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var CourseListLayoutView = require('course/course-list-layout-view');
    var userChannel = require('user/module');
    
    var controller = {
        allCoursesPage: function() {
            var layout = App.show(new CourseListLayoutView());
            layout.showAllCourses();
        },
        userCoursesPage: function() {
            var layout = App.show(new CourseListLayoutView());
            layout.showUserCourses();
        }
    }

    App.Router.processAppRoutes(controller, {
        "(/)": "allCoursesPage",
        "courses(/)": "allCoursesPage",
        "user/courses(/)": "userCoursesPage"
    });
    
    userChannel.on('logout', function() {
        App.go('/', {trigger:true, replace: true});
    });
});