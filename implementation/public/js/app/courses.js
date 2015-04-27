/**  @author Michael Murphy */
define(['jquery', 'underscore', 'backbone', 'handlebars', 'text!templates/courses.hbs', 'app/app'], function($, _, Backbone, Handlebars, template, app) {
   var Course = Backbone.Model.extend({
      idAttribute: "_id"
   });
   var Courses = Backbone.Collection.extend({
      model:Course,
      url: '/api/Course'
   });
});