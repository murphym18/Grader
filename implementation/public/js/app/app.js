define(['jquery', 'underscore', 'backbone', 'handlebars', 'text!templates/rootLayoutView.hbs', 'text!templates/error.hbs', 'backbone.marionette', 'radio.shim', 'backbone.radio', 'app/home'], function($, _, Backbone, Handlebars, rootLayoutTemplate, errorTemplate, Marionette) {
   Backbone.Marionette.Renderer.render = function(template, data){
      return template(data);
   };
   var ErrorView = Marionette.ItemView.extend({
      template: Handlebars.compile(errorTemplate),
      initialize: function() {
      }
   });

   var ErrorRouter = Marionette.AppRouter.extend({
      withAjaxResults: function (res) {
         var data = JSON.parse(res.responseText);
         var view = new ErrorView({model: new Backbone.Model(data)});
         app.rootView.getRegion('main').show(view);
      },
      routes: {
         "*any": "displayErrorPage"
      },
      displayErrorPage: function(){
         var self = this;
         $.ajax({
            url: window.location.href,
            method: 'GET',
            headers: {
               Accept : "application/json; q=1"
            },
            success: self.withAjaxResults,
            error: self.withAjaxResults
         });
      }
   });
   var errorRouter = new ErrorRouter();

   var RootView = Marionette.LayoutView.extend({
      template: Handlebars.compile(rootLayoutTemplate),
      regions: function(options) {
         return {
            header: "header.root",
            main: "main.root",
            footer: "footer.root"
         }
      },
      initialize: function() {
      },
      reset: function() {
         this.regionManager.forEach(function(region) {region.reset();});

      }
   });
   var app = window.app = new Marionette.Application({
      initialize: function() {
         this.rootView = new RootView({destroyImmediate: true, el: $("body")});
         this.rootView.render();
      },
      navigate: function(path) {
         if (Backbone.History.started) {
            Backbone.history.navigate(path, {trigger: true, replace: false});
         }
      }
   });


   app.on("start", function(){
      Backbone.history.start({pushState: true});
   });

   return app
});