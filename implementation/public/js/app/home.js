/** @author Michael Murphy */
define(['app/app', 'app/top-menu', 'app/courses'], function(App, TopNavView, CourseListView) {
   /* */
   function buildListCoursesPage() {
      var layout = App.show(new App.StandardLayoutView());
      var courses = new CourseListView({collection: App.UserCourses});
      layout.getRegion('header').show(new TopNavView);
      App.UserCourses.once('sync', function() {
         layout.getRegion('main').show(courses);
         App.Backbone.history.navigate('/Courses', {trigger:false, replace: true});
      });
      App.login().then(function(){
         layout.getRegion('main').show(new App.Mn.ItemView({
            className: "loading",
            tagName: "h1",
            template: function(){
               return "loading...";
            },
            onShow() {
               this.$el().css('top', "205px").position({
                  of: window
               });
            }
         }))
         App.UserCourses.fetch();
      });
   };
   App.Router.processAppRoutes({loadPage:buildListCoursesPage},{
      "(/)": "loadPage",
      "Courses": "loadPage"
   })
});
//var mainView = new App.Marionette.ItemView({
//   template: App.Handlebars.compile(homeTemplate)
//});
