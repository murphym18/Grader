/**
@author Michael Murphy
*/
requirejs.config({
   // By default load any module IDs from js/lib
   baseUrl: 'js/lib',
   // except, if the module ID starts with "app",
   // load it from the js/app directory. paths
   // config is relative to the baseUrl, and
   // never includes a ".js" extension since
   // the paths config could be for a directory.
   paths: {
      app: '../app',
      text: 'text',
      templates: '../../templates'
   },
   // The shim configuration is simple to use:
   // (1) one states the dependencies (deps), if any, (which may be from the
   //     paths configuration, or may be valid paths themselves).
   // (2) (optionally) specify the global variable name from the file you're
   //     shimming, which should be exported to your module functions that
   //     require it. (If you don't specify the exports, then you'll need to
   //     just use the global, as nothing will get passed into your
   //     require/define functions.)
   shim: {
      underscore: {
         exports: '_'
      },
      backbone: {
         deps: ["underscore", "jquery"],
         exports: "Backbone"
      },
      angoose: {
         deps: ['jquery'],
         exports: "angoose"
      }
   }
});

// Start the main app logic.
requirejs(['jquery', 'underscore', 'backbone', 'handlebars', 'angoose', 'app/login', 'text!templates/home.hbs',

    /* ADD YOUR STUFF BELOW */
    'text!templates/addNewClassView.html'],
    /* ADD YOUR STUFF ABOVE */

    function($, _, Backbone, Handlebars, angoose, LoginScreen, homeView,

    /* ADD YOUR STUFF BELOW */
    addNewClassView)
    /* ADD YOUR STUFF ABOVE */

    {
       console.log(LoginScreen)
   /*************************************************************************
    * WRITE SOMETHING LINE THE BELOW
    *************************************************************************/



   /************************************************************************
    * WRITE SOMETHING LIKE ABOVE
    ************************************************************************/

    /**
     * @author Mike Ryu
     */
    //var AddNewClassView = Backbone.View.extend({
    //
    //   template: Handlebars.compile(addNewClassView),
    //   errorMessage: '',
    //
    //   initialize: function() {
    //      this.render();
    //   },
    //
    //   events: {
    //      "click button": "doAddClass"
    //   },
    //
    //   doAddClass: function(e) {
    //      e.preventDefault();
    //      var self = this;
    //
    //      console.log("Add Class button pressed!");
    //   }
    //
    //});

   var GraderAppRouter = Backbone.Router.extend({

      //todo add more routes...
      routes: {
         "login": "login"
      },

      currentScreen: null,

      login: function() {
         $('main').empty();
         this.currentScreen = new LoginScreen({ el: $('main')});
         this.currentScreen.on('login', function(user){
            alert('Login success!');
            console.dir(user);
         });
      }

   });

   // Initiate the router
   var router = new GraderAppRouter();

   function afterLogin() {
      router.navigate('home', {trigger: true, replace: true});
   }

   // Start Backbone history a necessary step for bookmarkable URL's
   Backbone.history.start('home', {trigger: true, replace: true});

   $(function() {
      router.navigate('login', {trigger: true, replace: true});

      /*
       * WRITE SOMETHING LIKE BELOW TO HAVE YOUR VIEW SHOW UP
       * $('main').html(someText)
       */
       //$('main').html(AddNewClassView);

   })
});