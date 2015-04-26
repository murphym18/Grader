define(['jquery', 'underscore', 'backbone', 'handlebars', 'text!templates/heading.hbs'], function($, _, Backbone, Handlebars, template) {
var HeadingView = Backbone.View.extend({
   template: Handlebars.compile(template),
   initialize: function(user){
      this.user = user;
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
});});