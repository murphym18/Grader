/**  @author Michael Murphy */
define(['jquery', 'underscore', 'backbone', 'handlebars', 'app/session', 'text!templates/login.hbs', 'domReady!'], function($, _, Backbone, Handlebars, session, loginTemplate) {
   return Backbone.View.extend({
      tagName: "form",
      className: "login",
      template: Handlebars.compile(loginTemplate),
      events: {
         "click button": "doLogin",
         "change input.username": "updateUser",
         "change input.password": "updatePass"
      },
      initialize: function() {
         this.render();
         this.listenTo(this.model, 'change', this.onChange);
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
});

