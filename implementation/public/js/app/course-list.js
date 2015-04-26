/**  @author Michael Murphy */
define(['jquery', 'underscore', 'backbone', 'handlebars', 'text!templates/course-list.hbs'], function($, _, Backbone, Handlebars, template) {
   function doLogin(e) {
      e.preventDefault();
      var self = this;
      var payload = {
         username: self.$("input[name='username']").val(),
         password: self.$("input[name='password']").val()
      };
      $.ajax({
         url: '/api/login',
         data: payload,
         method: 'POST',
         success: function() {ajaxSuccess.apply(self, _.toArray(arguments));}
      });
      this.$('.error').text('');
   }

   function ajaxSuccess(res, status, jqXHR) {
      if (res.message) {
         this.$('.error').text(res.message);
         this.resetInputs();
      }
      if (res.login) {
         this.afterLogin(res.user);
      }
   }

   function renderLoginScreen(){
      var html = this.template(this);
      this.$el.html(html)
      this.focus();
   }

   function afterLogin(user) {
      var self = this;
      this.$el.empty();
      this.username = user.username;
      this.trigger('login', user);
      setTimeout(function(){self.render()}, 1500);
   }

   function resetInputs() {
      this.$("input[name='username']").val(this.username);
      this.$("input[name='password']").val('');
   }

   function takeFocus() {
      if (this.username) {
         this.$("input[name='password']").focus();
      }
      else {
         this.$("input[name='username']").focus();
      }
   }
   var LoginScreen = Backbone.View.extend({
      template: Handlebars.compile(template),
      username: '',
      initialize: function(){
         this.render();
      },
      events: {
         "click button": "doLogin"
      },
      doLogin: doLogin,
      afterLogin: afterLogin,
      render: renderLoginScreen,
      resetInputs: resetInputs,
      focus: takeFocus
   });

   return LoginScreen;
});