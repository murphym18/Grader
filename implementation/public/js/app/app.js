/** @author Michael Murphy */
define(['jquery', 'underscore', 'backbone', 'handlebars', 'text!templates/rootLayoutView.hbs', 'backbone.marionette', 'radio.shim', 'backbone.radio'], function($, _, Backbone, Handlebars, rootLayoutTemplate, Marionette) {
   Backbone.Marionette.Renderer.render = function(template, data){
      return template(data);
   };

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
      routesChannel: Backbone.Radio.channel('routes'),
      initialize: function() {
         this.rootView = new RootView({destroyImmediate: true, el: $("body")});
         this.rootView.render();
      }
   });

   app.on("start", function(){
      Backbone.history.start({pushState: true});
   });

   return app
});