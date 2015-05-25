define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var userChannel = require('user/module');
    var noSessionTemplate = require('text!templates/headerLoginLink.hbs');
    var sessionTemplate = require('text!templates/headerLogoutLink.hbs');
    
    return Mn.ItemView.extend({
      className: "header-item",
      noSessionTemplate: Hbs.compile(noSessionTemplate),
      sessionTemplate: Hbs.compile(sessionTemplate),

      modelEvents: {
         "login": "render",
         "logout": "render"
      },
      
      ui: {
         button: "a"
      },
      
      events: {
         "click @ui.button": "doSessionAction"
      },
      
      initialize: function(options) {
         this.model = userChannel.request('session');
      },
      
      doSessionAction: function(domEvent) {
         domEvent.preventDefault();
         if (this.model.isAuthenticated()) {
            this.model.logout();
         }
         else {
            userChannel.command('login');
         }
      },
      
      getNameText: function() {
         var user = this.model.get('user');
         if (user.first && user.last) {
            return [user.first, user.last].join(' ');
         }
         else if (user.username) {
            return user.username;
         }
         else {
            return "Unknown User";
         }
      },
      
      render: function() {
         var template = this.noSessionTemplate;
         var ctx = {};
         if (this.model.isAuthenticated()) {
            ctx.name = this.getNameText();
            template = this.sessionTemplate;
         }
         this.$el.html(template(ctx));
      }
   });
});

