define(['app/app', 'app/session', 'text!templates/topMenu.hbs'], function(App, session, template) {
   var SessionView = App.Marionette.ItemView.extend({
      model: session,
      template: App.Handlebars.compile("{{beforeText}}<a href=\"#\">{{action}}</a>{{afterText}}"),

      modelEvents: {
         "login": "render",
         "logout": "render"
      },
      ui: {
         button: "a"
      },
      events: {
         "click @ui.button": "sessionAction"
      },
      sessionAction: function(domEvent) {
         domEvent.preventDefault();
         if (this.model.isAuthenticated()) {
            session.logout();
         }
         else {
            App.login();
         }
      },
      render: function() {
         var action = this.model.isAuthenticated() ? "Sign Out" : "Sign In";
         var before = this.model.isAuthenticated() ? "Signed in as ".concat(this.model.get('user').username) + " (" : "";
         var after = this.model.isAuthenticated() ? ")" : "";
         this.$el.html(this.template({
            action: action,
            beforeText: before,
            afterText: after
         }));
      }
   });
   var TopMenuLayoutView = Marionette.LayoutView.extend({
      template: App.Handlebars.compile(template),
      regions: function(options) {
         return {
            menu: ".menu",
            session: ".session"
         }
      },
      onShow: function() {
         this.getRegion("session").show(new SessionView());
      }

   });
   return TopMenuLayoutView;
})

