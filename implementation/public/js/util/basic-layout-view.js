/**
 * A LayoutView with 3 regions: `header`, `main`, and `footer`
 * @author Michael Murphy
 */
define(function (require) {
   var $ = require('jquery');
   var _ = require('underscore');
   var Q = require('q');
   var Backbone = require('util/backbone-helper');
   
   var Handlebars = require('handlebars');
   var standardLayoutTemplate = require('text!templates/standardLayout.hbs');
   
   return Backbone.Marionette.LayoutView.extend({
      template: Handlebars.compile(standardLayoutTemplate),
      regions: function(options) {
         return {
            header: "header.root",
            main: "main.root",
            footer: "footer.root"
         }
      },
      destroyImmediate: true
   });
});