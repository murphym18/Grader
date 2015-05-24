/**  @author Michael Murphy */
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var PopupView = require('util/popup-view');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    var loginTemplate = require('text!templates/login.hbs');
    
    var userChannel = Radio.channel('user');
    
    return PopupView.extend({
      tagName: 'form',
      className: 'login',
      template: Hbs.compile(loginTemplate),
      
      ui: {
         username: "input.username",
         password: "input.password",
         error: "div.error"
      },
      
      events: {
         "click .submit": "doLogin",
         "change @ui.username": "updateUser",
         "change @ui.password": "updatePass"
      },
      
      modelEvents: {
         "change": "onShow"
      },
      
      popup: {
         modal: true,
         focus: "input.username"
      },
      
      initialize: function(options) {
         if (!this.model) {
            this.model = userChannel.request('session');
         }
      },
      
      doLogin: function(domEvent) {
         domEvent.preventDefault();
         this.model.login();
      },
      
      updateUser: function() {
         var input = this.ui.username.val();
         this.model.set({"username": input});
      },
      
      updatePass: function() {
         var input = this.ui.password.val();
         this.model.set({"password": input});
      },
      
      onShow: function() {
         this.ui.username.val(this.model.get('username'));
         this.ui.password.val(this.model.get('password'));
         this.ui.error.text(this.model.get('message'));
      },
      
      focus: function() {
         console.dir(this.ui);
         if (!this.ui.username.val()) {
            this.ui.username.focus();
         }
         else {
            this.ui.password.focus();
         }
      }
   });
   
   
});

