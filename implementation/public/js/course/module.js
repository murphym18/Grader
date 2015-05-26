define(function (require) {
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var LoadingView = require('util/promise-loading-view');
    var CourseList = require('course/course-list');
    var CourseListView = require('course/view/course-list-view');
    var NavCourseFilterView = require('course/nav/filter-list-view');
    var NavCreateCourseView = require('course/nav/new-course-button-view')
    var Radio = require('backbone.radio');
    var userChannel = require('user/module');
    var pageChannel = Radio.channel('page');
    var courseChannel = Radio.channel('course');
    var Course = require('course/course');
    
    var NavItemsCollectionView = Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'nav navbar-nav grader-navbar-left',
        getChildView: function(item) {
            return item.get('viewClass');
        }
    });
    
    var navBarViews = new Backbone.Collection([
        new Backbone.Model({
            viewClass: NavCourseFilterView
        }),
        new Backbone.Model({
            viewClass: NavCreateCourseView
        })
    ]);

    var controller = {
        allCoursesPage: function() {
            var courseList = new CourseList();
            var coursesPromise = courseList.fetch()
            var mainRegion = pageChannel.request('mainRegion');
            mainRegion.show(new LoadingView({
                promise: coursesPromise
            }));
            coursesPromise.then(function() {
                var navRegion = pageChannel.request('navRegion');
                navRegion.show(new NavItemsCollectionView({
                    collection: navBarViews
                }));
                mainRegion.show(new CourseListView({
                    collection: courseList
                }));
                courseChannel.comply('updateCourses', function(){
                    courseList.fetch();
                    courseList.sort();
                });
                App.go('/courses', {trigger:false, replace: true});
            });

        },
        userCoursesPage: function() {
            var loginPromise = userChannel.request('user');
            loginPromise.then(function(user) {
                var userCoursesPromise = userChannel.request('user:courses');
                var mainRegion = pageChannel.request('mainRegion');
                
                mainRegion.show(new LoadingView({
                    promise: userCoursesPromise
                }));
                userCoursesPromise.then(function(userCourses) {
                    var navRegion = pageChannel.request('navRegion');
                    navRegion.show(new NavItemsCollectionView({
                        collection: navBarViews
                    }));
                    mainRegion.show(new CourseListView({
                        collection: userCourses
                    }));
                    courseChannel.comply('updateCourses', function(){
                        userCourses.fetch();
                        userCourses.sort();
                    });
                    App.go('/user/courses', {
                        trigger:false,
                        replace: true
                        
                    });
                });
            });

        },
        loadCoursePage: function(path) {
            var course = new Course({
                colloquialUrl: path
            });
            course.fetch({populate: true}).then(function(c) {
                console.dir(course);
                window.x = course;
            })
            console.log('in load course page',path);
        }
    }
    
    courseChannel.comply('showUserCourses', function() {
        controller.userCoursesPage();
    });
    
    courseChannel.comply('showAllCourses', function() {
        controller.allCoursesPage();
    });

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