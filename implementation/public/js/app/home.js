/** @author Michael Murphy */
define(function (require) {
   var App = require('app/app');
   var Backbone = require('util/backbone-helper');
   var TopNavView = require('app/top-menu');
   var CourseListView = require('app/courses');
   var LoadingView = require('util/loading-view');
   var userChannel = require('user/module');
   var StandardLayoutView = require('util/standard-layout-view');
   
   function buildListCoursesPage() {
      var layout = App.show(new StandardLayoutView());
      var courses = new CourseListView({collection: App.UserCourses});
      layout.getRegion('header').show(new TopNavView);
      

      userChannel.request('login').then(function(){
         var loading = new LoadingView({
            model: App.UserCourses
         });
         layout.getRegion('main').show(loading);
         App.UserCourses.once('sync', function() {
            layout.getRegion('main').show(courses);
            Backbone.history.navigate('/Courses', {trigger:false, replace: true});
         });
         App.UserCourses.fetch();
      });
   }
   
   App.showCoursesList = buildListCoursesPage;
   App.Router.processAppRoutes({loadPage:buildListCoursesPage},{
      "(/)": "loadPage",
      "Courses(/)": "loadPage"
   })
});
