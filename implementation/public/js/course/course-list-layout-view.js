define(function (require) {
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    
    var HeaderMenuView = require('util/header-menu-view');
    var CourseList = require('course/course-list');
    var CourseListView = require('course/course-list-view');
    var LoadingView = require('util/promise-loading-view');
    var BasicLayoutView = require('util/basic-layout-view');
    
    var userChannel = require('user/module');
    
    return BasicLayoutView.extend({
        initialize: function(options) {
            this.headerView = new HeaderMenuView();
            if (options.courseListView)
                this.mainView = options.courseListView;
        },
        
        showUserCourses: function() {
            var self = this;
            var loginPromise = userChannel.request('user');
            loginPromise.then(function(user) {
                var userCoursesPromise = userChannel.request('user:courses');
                self.showMain(new LoadingView({
                    promise: userCoursesPromise
                }));
                userCoursesPromise.then(function(userCourses) {
                    self.showMain(new CourseListView({
                        collection: userCourses
                    }));
                    App.go('/user/courses', {
                        trigger:false,
                        replace: true
                        
                    });
                });
            });
        },
        
        showAllCourses: function() {
            var self = this;
            var courseList = new CourseList();
            var coursesPromise = courseList.fetch()
            self.showMain(new LoadingView({
                promise: coursesPromise
            }));
            coursesPromise.then(function() {
                self.showMain(new CourseListView({
                    collection: courseList
                }));
                App.go('/courses', {trigger:false, replace: true});
            });
        }
    });
});