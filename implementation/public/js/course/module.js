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
        },
        loadCoursePage: function(path) {
            console.log('in load course page',path);
        }
    }

    App.Router.processAppRoutes(controller, {
        "(/)": "allCoursesPage",
        "courses(/)": "allCoursesPage",
        "user/courses(/)": "userCoursesPage",
        "courses/:path(/)": "loadCoursePage"
    });
    
    userChannel.on('logout', function() {
        App.go('/', {trigger:true, replace: true});
    });
});