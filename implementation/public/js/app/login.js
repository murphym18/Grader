/**  @author Michael Murphy */
define(['jquery', 'backbone', 'backbone.marionette', 'app/app', 'handlebars', 'app/session', 'text!templates/login.hbs'], function($, Backbone, Marionette, App, Handlebars, session, loginTemplate) {
   var LoginView = App.LoginView = App.PopupView.extend({
      tagName: 'form',
      className: 'login',
      template: Handlebars.compile(loginTemplate),
      
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
         this.model = this.model ? this.model : session;
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
   
   App.login = function() {
      var deferred = App.Q.defer();
      if (session.isAuthenticated()) {
         deferred.resolve(session.get('user'));
      }
      else {
         session.once('login', function(user) {
            App.PopupRegion.close();
            deferred.resolve(user);
         });
         App.PopupRegion.show(new App.LoginView());
      }
      return deferred.promise;
   };
   
   return LoginView;
});

