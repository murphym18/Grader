/**  @author Michael Murphy */
define(['jquery', 'backbone', 'backbone.marionette', 'app/app', 'handlebars', 'app/session', 'text!templates/login.hbs'], function($, Backbone, Marionette, app, Handlebars, session, loginTemplate) {
   var LoginView = Marionette.View.extend({
      tagName: 'form',
      className: 'login',
      template: Handlebars.compile(loginTemplate),
      events: {
         "click button": "doLogin",
         "change input.username": "updateUser",
         "change input.password": "updatePass"
      },
      initialize: function() {
         this.render();
         this.listenTo(this.model, 'change', this.onChange);
         this.on('show', function() {
            this.render();
            this.focus();
         });
      },
      doLogin: function(domEvent) {
         domEvent.preventDefault();
         this.model.login();
      },
      updateUser: function() {
         var input = this.username.val();
         this.model.set({"username": input});
      },
      updatePass: function() {
         var input = this.password.val();
         this.model.set({"password": input});
      },
      render: function() {
         this.$el.html(this.template(this.model.attributes));
         this.username = this.$("input.username");
         this.password = this.$("input.password");
         this.errorMessage = this.$("div.error");
         this.onChange();
      },
      onChange: function() {
         this.username.val(this.model.get('username'));
         this.password.val(this.model.get('password'));
         this.errorMessage.text(this.model.get('message'));
         this.focus()
      },
      focus: function() {
         if (!this.model.get('username')) {
            this.username.focus();
         }
         else {
            this.password.focus();
         }
      }
   });

   var loginPageBuilder = {
      displayLoginPage: function() {
         var loginView = new LoginView({model: session});
         app.initialize();
         app.rootView.getRegion('main').show(loginView);
         loginView.focus();
      },
      displayLoginPageThenNav: function() {
         this.displayLoginPage();
         Backbone.history.navigate('/login', {trigger: false, replace: false});
      }
   }

   app.routesChannel.comply('/login', function() {
      loginPageBuilder.displayLoginPageThenNav();
   });

   app.on('before:start', function() {
      app.LoginRouter = new Marionette.AppRouter({
         appRoutes: {
            "login": "displayLoginPage"
         },
         controller: loginPageBuilder
      });
   });

});

