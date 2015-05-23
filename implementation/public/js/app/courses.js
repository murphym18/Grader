/**  @author Michael Murphy */
define(['app/app', 'app/session', 'text!templates/courseListing.hbs'], function(App, session, courseListItemTemplate) {
   var Backbone = App.Backbone;
   
   var Course = Backbone.Model.extend({
      idAttribute: "colloquialUrl",
      findGraphArray: function(data) {

      },
      initialize : function (){
         this.updateUrl()
      },
      updateUrl: function updateUserCourses() {
         if (session.get('user') && session.get('user').username) {
            this.url = '/api/Courses/' + this.get("colloquialUrl");
         }
      }

   });

   var UserCoursesList = Backbone.Collection.extend({
      tagName: 'ul',
      className: 'courseList',
      model:Course,
      
      comparator: function(item) {
         return [
            item.get("start"),
            item.get("classCode"),
            item.get("classNumber")
         ];
      },
      
      updateUrl: function updateUserCourses() {
         if (session.get('user') && session.get('user').username) {
            this.url = '/api/Users/'+session.get('user').username+'/Courses';
         }
      },
      
      initialize: function() {
         this.listenTo(session, 'change:user', this.updateUrl);
         this.listenTo(session, 'logout', this.clear);
         this.updateUrl();
      },
      
      clear: function() {
         this.reset([]);
      }
   });



   var CourseListItemView = App.Mn.ItemView.extend({
      tagName: "li",
      className: "course-list-item",
      template: App.Handlebars.compile(courseListItemTemplate),
      modelEvents: {
         "change": "render",
      },
      events: {
         'click a': "openGradebook"
      },
      openGradebook: function loadGradebookPage(domEvent) {
         App.go('/Courses/'+this.model.get('colloquialUrl'));
         domEvent.preventDefault();
      }
   });

   var EmptyCourseListView = App.Mn.ItemView.extend({
      template: function() {
         return "";
      }
   });

   var CourseListView = App.Mn.CollectionView.extend({
      className: "coursesList",
      childView: CourseListItemView,
      emptyView: EmptyCourseListView,
   });

   App.UserCourses = new UserCoursesList();
   App.Course = Course;
   App.listenTo(session, 'logout', function() {
      App.Backbone.history.navigate('/', {trigger:false, replace: true});
      App.showCoursesList();
   });
   return CourseListView
});