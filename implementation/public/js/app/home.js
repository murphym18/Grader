/** @author Michael Murphy */
define(['app/app', 'app/top-menu', 'text!templates/home.hbs'], function(App, TopMenuView, homeTemplate) {
   var MainView = App.Marionette.ItemView.extend({
      template: App.Handlebars.compile(homeTemplate)
   });

   var homePageController = {
      displayHomePage: function() {
         var homeLayout = App.show(new App.StandardLayoutView());
         homeLayout.getRegion('main').show(new MainView({model: new Backbone.Model()}));
         homeLayout.getRegion('header').show(new TopMenuView());
      }
   };

   App.Router.processAppRoutes(homePageController,  {
      "(/)": "displayHomePage"
   });
});
