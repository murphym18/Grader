/**
@author Michael Murphy
*/
requirejs.config({
   // By default load any module IDs from js/lib
   baseUrl: '/js/lib',
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
requirejs(['jquery', 'underscore', 'backbone', 'handlebars', 'angoose', 'app/session', 'app/login', 'text!templates/error.hbs'], function($, _, Backbone, Handlebars, angoose, session, LoginScreen, errorTemplate) {
   function withRes(res) {
      var context = JSON.parse(res.responseText);
      $('body').html(Handlebars.compile(errorTemplate)(context));
   }

   $.ajaxSetup({
      error: withRes
   });

   console.log()
   var AppRouter = Backbone.Router.extend({
      errorPage: Handlebars.compile(errorTemplate),
      currentScreen: null,
      //todo add more routes...
      routes: {
         "login(/)": "login",
         "courses(/)": "courses",
         "(/)": "home",
         "*any": "error404"
      },
      login: function() {
         //if (session.isAuthenticated()) {
         //   router.navigate(this.afterLoginPath || '/', {trigger: true, replace: false});
         //   return;
         //}
         var loginScreen = new LoginScreen({model: session, el: $('main')});
         loginScreen.focus();
         session.once('login', function(user){
            router.navigate(this.afterLoginPath || '/', {trigger: true, replace: false});
         });
      },
      courses: function() {
         //if (!session.isAuthenticated()) {
         //   this.navigate('login', {trigger: true, replace: true});
         //   this.login();
         //}
         $('main').empty();
         $('main').append("courses");
         console.log('hi')
      },
      home: function(){
         $('main').empty().append("home");
         if (!session.isAuthenticated()) {
            //router.navigate('login');
            //this.login();
            //this.navigate('login', {trigger: true, replace: true});
         }
         else {
         }
      },
      error404: function(){
         $.ajax({
            url: window.location.href,
            method: 'GET',
            headers: {
               Accept : "application/json; q=1"
            },
            success: withRes
         });
      }
   });

   // Initiate the router
   var router = new AppRouter();
   Backbone.history.start({pushState: true});
   router.navigate(window.location.pathname.substr(1), {trigger: true, replace: true});
});

/**
 * @author Mike Ryu
 */
// 'text!templates/addNewClassView.html' addNewClassView
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