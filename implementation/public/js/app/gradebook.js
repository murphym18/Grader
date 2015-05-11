define(['jquery', 'backbone', 'backbone.marionette', 'app/app', 'handlebars'],function($, _, Backbone, Marionette, app, HandleBars){
   var GradebookView= Marionette.CompositeView.extend({

   })
   var ChildView = Backbone.Marionette.ItemView.extend({});

   var CompView = Backbone.Marionette.CompositeView.extend({
      childView: ChildView,
      template: "#leaf-branch-template"
   });
});
