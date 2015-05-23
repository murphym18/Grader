/** @author Michael Murphy */
define(['app/app', 'app/top-menu', 'app/courses'], function(App, TopNavView, CourseListView) {
   /* */
   function buildListCoursesPage() {
      var layout = App.show(new App.StandardLayoutView());
      var courses = new CourseListView({collection: App.UserCourses});
      layout.getRegion('header').show(new TopNavView);
      
      var loading = new App.LoadingView({
         model: App.UserCourses
      });
      App.login().then(function(){
         layout.getRegion('main').show(loading);
         App.UserCourses.once('sync', function() {
            layout.getRegion('main').show(courses);
            App.Backbone.history.navigate('/Courses', {trigger:false, replace: true});
         });
         App.UserCourses.fetch();
      });
   };
   App.showCoursesList = buildListCoursesPage;
   App.Router.processAppRoutes({loadPage:buildListCoursesPage},{
      "(/)": "loadPage",
      "Courses(/)": "loadPage"
   })
});
