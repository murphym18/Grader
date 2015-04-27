/** @author Michael Murphy */
define(['jquery', 'underscore', 'backbone', 'handlebars', 'backbone.marionette', 'app/app', 'app/session', 'text!templates/topMenu.hbs', 'text!templates/home.hbs'], function($, _, Backbone, Handlebars, Marionette, app, session, topMenuTemplate, homeTemplate) {
   TopMenuView = Marionette.ItemView.extend({
      tagName: 'nav',
      template: Handlebars.compile(topMenuTemplate),
      events: {
         "click button.logout": "doLogout"
      },
      doLogout: function(domEvent) {
         session.logout();
      }
   });

   MainHomeView = Marionette.ItemView.extend({
      template: Handlebars.compile(homeTemplate)
   });

   var homePageBuilder = {
      displayHomePage: function() {
         app.rootView.initialize();
         app.rootView.getRegion('main').show(new MainHomeView({}));
         app.rootView.getRegion('header').show(new TopMenuView({}));
         app.rootView.render();
         console.log('sjkdsfhkshfd')
      },
      displayHomePageThenNav: function() {
         this.displayHomePage();
         Backbone.history.navigate('/', {trigger: false, replace: false});
      }
   };
   var routesChannel = Backbone.Radio.channel('routes');
   routesChannel.comply('/', function() {
      homePageBuilder.displayHomePageThenNav();
      console.log('test');
   });

   app.on('before:start', function() {
      var HomeRouter = Marionette.AppRouter.extend({
         appRoutes: {
            "/": "displayHomePage"
         },
         controller: homePageBuilder
      });
   });
   app.on('before:start', function() {
      app.LoginRouter = new Marionette.AppRouter({
         appRoutes: {
            "login": "displayLoginPage"
         },
         controller: loginPageBuilder
      });
   });
   var routesChannel = Backbone.Radio.channel('routes');
   routesChannel.comply('/', function() {
       homePageBuilder
       });
   app.on('start')
   if(session.isAuthenticated() && window.location.pathname !== '/login') {
      showTopMenu();
   }
   return TopMenuView;
});
