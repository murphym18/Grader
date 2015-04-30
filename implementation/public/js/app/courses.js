/**  @author Michael Murphy */
define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'handlebars', 'app/app'], function($, _, Backbone, Marionette, Handlebars, app, template, app) {
   var Course = Backbone.Model.extend({
      idAttribute: "colloquialUrl"
   });
   var Courses = Backbone.Collection.extend({
      model:Course,
      url: '/api/Courses'
   });
});