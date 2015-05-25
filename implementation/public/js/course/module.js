define(function (require) {
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var LoadingView = require('util/promise-loading-view');
    var CourseList = require('course/course-list');
    var CourseListView = require('course/course-list-view');
    var Radio = require('backbone.radio');
    var userChannel = require('user/module');
    var pageChannel = Radio.channel('page');

    var controller = {
        allCoursesPage: function() {
            var courseList = new CourseList();
            var coursesPromise = courseList.fetch()
            var mainRegion = pageChannel.request('mainRegion');
            mainRegion.show(new LoadingView({
                promise: coursesPromise
            }));
            coursesPromise.then(function() {
                mainRegion.show(new CourseListView({
                    collection: courseList
                }));
                App.go('/courses', {trigger:false, replace: true});
            });

        },
        userCoursesPage: function() {
            var loginPromise = userChannel.request('user');
            loginPromise.then(function(user) {
                var userCoursesPromise = userChannel.request('user:courses');
                
                mainRegion.show(new LoadingView({
                    promise: userCoursesPromise
                }));
                userCoursesPromise.then(function(userCourses) {
                    mainRegion.show(new CourseListView({
                        collection: userCourses
                    }));
                    App.go('/user/courses', {
                        trigger:false,
                        replace: true
                        
                    });
                });
            });

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