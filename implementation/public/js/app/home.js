/** @author Michael Murphy */
define(['app/app', 'app/top-menu', 'text!templates/home.hbs'], function(App, TopNavView, homeTemplate) {
   /* */
   App.Router.route("(/)", "home", function() {
      var layout = App.show(new App.StandardLayoutView());
      var mainView = new App.Marionette.ItemView({
         template: App.Handlebars.compile(homeTemplate)
      });
      layout.getRegion('main').show(mainView);
      layout.getRegion('header').show(new TopNavView);
   });
});
