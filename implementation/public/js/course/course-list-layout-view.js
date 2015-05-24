define(function (require) {
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    
    var TopNavView = require('app/top-menu');
    var CourseListView = require('course/course-list-view');
    var LoadingView = require('util/loading-view');
    var BasicLayoutView = require('util/basic-layout-view');
    
    var userChannel = require('user/module');
    
   
    function buildListCoursesPage() {
        var layout = App.show(new BasicLayoutView());
        var courses = new CourseListView({collection: userCourses});
        layout.getRegion('header').show(new TopNavView);
        var loading = new LoadingView({
            model: userCourses
        });
        layout.getRegion('main').show(loading);
        userCourses.once('sync', function() {
            layout.getRegion('main').show(courses);
            Backbone.history.navigate('/Courses', {trigger:false, replace: true});
        });
        userCourses.fetch();
        // userChannel.request('login').then(function() {
            
        // });
    }
   
   App.showCoursesList = buildListCoursesPage;
   App.Router.processAppRoutes({loadPage:buildListCoursesPage},{
      "(/)": "loadPage",
      "Courses(/)": "loadPage"
   })
});