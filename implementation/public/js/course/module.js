define(function (require) {
    var _ = require('underscore')
    var Q = require('q')
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var LoadingView = require('util/promise-loading-view');
    var CourseList = require('course/course-list');
    var CourseListView = require('course/view/course-list-view');
    var NavCourseFilterView = require('course/nav/filter-list-view');
    var NavCreateCourseView = require('course/nav/new-course-button-view');
    var NavModifyCourseView = require('course/nav/modify-course-button-view');
    var NavCourseDropdownView = require('course/nav/course-dropdown-view');
    var NavStudentDropdownView = require('course/nav/student-dropdown-view');
    
    var NavAssignmentDropdownView = require('course/nav/assignment-dropdown-view');
    var Radio = require('backbone.radio');
    var userChannel = require('user/module');
    var pageChannel = Radio.channel('page');
    var courseChannel = Radio.channel('course');
    var Course = require('course/course');
    var GradeBookView = require('course/view/gradebook-view');
    require('course/view/modify-course-view');
    var err = function(){throw new Error()};
    courseChannel.request('default', err)
    courseChannel.comply('default', err)
    pageChannel.request('default', err)
    pageChannel.comply('default', err)
    userChannel.request('default', err)
    userChannel.comply('default', err)
    

    //var NavModifyCourseView = require('course/view/modify-course-view');
    
    var Registry = Backbone.Collection.extend({
         constructor: function Registery() {
             Backbone.Collection.apply(this);
         }
     });

    var registry = window.regestery = new Registry();
    courseChannel.comply('register', function(doc) {
        registry.add(doc);
    });
    
    var NavItemsCollectionView = Mn.CollectionView.extend({
        tagName: 'ul',
        className: 'nav navbar-nav grader-navbar-left',
        getChildView: function(item) {
            return item.get('viewClass');
        }
    });
    
    var navBarAllCoursesViews = new Backbone.Collection([
        new Backbone.Model({
            viewClass: NavCourseFilterView
        }),
        new Backbone.Model({
            viewClass: NavCreateCourseView
        })
    ]);

    var navBarCourseSpecificViews = new Backbone.Collection([
        new Backbone.Model({
            viewClass: NavCourseDropdownView
        }),
        new Backbone.Model({
            viewClass: NavStudentDropdownView
        }),
        new Backbone.Model({
            viewClass: NavAssignmentDropdownView
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
            Q(coursesPromise).then(function() {
                var navRegion = pageChannel.request('navRegion');
                navRegion.show(new NavItemsCollectionView({
                    collection: navBarAllCoursesViews
                }));
                mainRegion.show(new CourseListView({
                    collection: courseList
                }));
                courseChannel.comply('updateCourses', function(){
                    courseList.fetch();
                    courseList.sort();
                });
                App.go('/', {trigger:false, replace: true});
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
                    var navRegion = pageChannel.request('navRegion');
                    navRegion.show(new NavItemsCollectionView({
                        collection: navBarAllCoursesViews
                    }));
                    var mainRegion = pageChannel.request('mainRegion');
                    mainRegion.show(new CourseListView({
                        collection: userCourses
                    }));
                    courseChannel.comply('updateCourses', function(){
                        userCourses.fetch();
                        userCourses.sort();
                    });
                    // App.go('/user/courses', {
                    //     trigger:false,
                    //     replace: true
                        
                    // });
                });
            });

        },
        loadCoursePage: function(path) {
            console.log(path);
            registry.reset();
            pageChannel.request('mainRegion').empty();
            
            var course = new Course({
                colloquialUrl: path
            });
            
            Q(course.fetch({populate: true})).then(function(c) {
                window.setTimeout(function() {
                    var navRegion = pageChannel.request('navRegion');
                    navRegion.show(new NavItemsCollectionView({
                        collection: navBarCourseSpecificViews
                    }));
                    window.x = course;
                    var mainRegion = pageChannel.request('mainRegion');
                    mainRegion.show(new GradeBookView());
                    console.dir(course);
                    console.log('in load course page',path);
                }, 1) 
                courseChannel.reply('current:course', function() {
                    return course;
                })

                
               
            });
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
        //App.go('/', {trigger:true, replace: true});
    });
});