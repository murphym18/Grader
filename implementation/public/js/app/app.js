/**
 * @author Michael Murphy
 */
define(function (require) {
   var $ = require('jquery');
   var _ = require('underscore');
   var Q = require('q');
   var Handlebars = require('handlebars');
   var Backbone = require('util/backbone-helper');
   var ModalRegion = require('util/modal-region');
   var PopupRegion = require('util/popup-region');
   var RootRegion = require('util/root-region');
   
   function navigateToPage(path, options) {
      var options = _.extend({
         trigger: true,
         replace: false
      }, options);
      Backbone.history.navigate(path, options);
   }
   
   /**
    * A container object for the application. By requiring this module you gain
    * access to  various libraries  and other application components
    */
   var App = window.App = new Backbone.Marionette.Application({
   
      /**
       * The jQuery JavaScript library.
       * http://api.jquery.com/
       */
      $: $,
   
      /**
       * The underscore JavaScript library.
       * http://underscorejs.org/
       */
      _: _,
   
      /**
       * The handlebars JavaScript library.
       * http://handlebarsjs.com/
       */
      Handlebars: Handlebars,
   
      /**
       * An alias for the handlebars JavaScript library.
       * http://handlebarsjs.com/
       */
      Mustache: Handlebars,
   
      /**
       * An alias for the handlebars JavaScript library.
       * http://handlebarsjs.com/
       */
      Hbs: Handlebars,
   
      /**
       * The backbone JavaScript library.
       * http://backbonejs.org/
       */
      Backbone: Backbone,
   
      /**
       * The Marionettes JavaScript library
       * http://marionettejs.com/
       */
      Marionette: Backbone.Marionette,
   
      /**
       * An alias for the Marionettes JavaScript library
       * http://marionettejs.com/
       */
      Mn: Backbone.Marionette,
      
      
   
      /**
       * The Q JavaScript library. My favorite promise library :)
       * https://github.com/kriskowal/q
       */
      Q: Q,
   
      /**
       * A framework for decoupling components of the application.
       * https://github.com/marionettejs/backbone.radio
       */
      Radio: Backbone.Radio,
   
      Relational: Backbone.Relational,
   
      /**
       * A marionette router.
       */
      Router: new Backbone.Marionette.AppRouter({
         routes : {}
      }),
      
      initialize: function() {
         this.modal = new ModalRegion();
         this.RootRegion = new RootRegion();
         this.PopupRegion = new PopupRegion();
      },
   
      /**
       * A method to navigate to route in the application.
       */
      go: navigateToPage,
   
      /**
       * A convenience method to show up you inside the RootRegion.
       * @param view A marionette view
       * @returns {*} the view parameter
       */
      show: function(view) {
         this.RootRegion.show(view);
         return view;
      }
   });
   
   App.on("start", function(){
      Backbone.history.start({pushState: true});
   });
   
   return App
});