/** @author Michael Murphy */
define(['jquery', 'underscore', 'backbone', 'handlebars', 'backbone.marionette', 'app/app', 'app/session', 'text!templates/topMenu.hbs', 'text!templates/home.hbs', 'text!templates/error.hbs'], function($, _, Backbone, Handlebars, Marionette, app, session, topMenuTemplate, homeTemplate, errorTemplate) {
   var ErrorView = Marionette.ItemView.extend({
      template: Handlebars.compile(errorTemplate),
      initialize: function() {
      }
   });

   var TopView = Marionette.ItemView.extend({
      tagName: 'nav',
      template: Handlebars.compile(topMenuTemplate),
      events: {
         "click button.logout": "doLogout"
      },
      doLogout: function(domEvent) {
         session.logout();
      }
   });

   var MainView = Marionette.ItemView.extend({
      template: Handlebars.compile(homeTemplate)
   });

   var homePageController = {
      displayHomePage: function() {
         app.rootView.getRegion('main').show(new MainView({model: new Backbone.Model()}));
         app.rootView.getRegion('header').show(new TopView({model: new Backbone.Model()}));
      },
      displayHomePageThenNav: function() {
         this.displayHomePage();
         Backbone.history.navigate('/', {trigger: false, replace: false});
      },
      displayErrorPage: function(){
         function withAjaxResults(res) {
            var data = JSON.parse(res.responseText);
            var view = new ErrorView({model: new Backbone.Model(data)});
            app.rootView.getRegion('main').show(view);
         }

         $.ajax({
            url: window.location.href,
            method: 'GET',
            headers: {
               Accept : "application/json; q=1"
            },

            error: withAjaxResults
         });
      }
   };

   app.routesChannel.comply('/', function() {
      homePageController.displayHomePageThenNav();

   });

   app.on('before:start', function() {
      app.homeRouter = new Marionette.AppRouter({
         controller: homePageController,
         appRoutes: {
            "(/)": "displayHomePage"
         }
      });
   });

   return TopView;
});
