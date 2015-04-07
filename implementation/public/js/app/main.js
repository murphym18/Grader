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
      }
   }
});

// Start the main app logic.
requirejs(['jquery', 'underscore', 'backbone', 'handlebars', 'text!templates/loginView.hbs', 'text!templates/home.hbs'],function($, _, Backbone, Handlebars, loginView, homeView) {

   var LoginView = Backbone.View.extend({

      template: Handlebars.compile(loginView),
      errorMessage: '',

      initialize: function(){
         this.render();
      },

      events: {
         "click button": "doLogin"
      },

      doLogin: function(e) {
         e.preventDefault();
         var self = this;
         var payload = {
            username: this.$("input[name='username']").val(),
            password: this.$("input[name='password']").val()
         };
         $.ajax({
            url: '/api/login',
            data: payload,
            method: 'POST',
            success: function(res, status, jqXHR) {
               if (res.message) {
                  self.errorMessage = res.message;
               }
               else {
                  self.errorMessage = '';
               }
               if (res.login) {
                  // successful user login
                  alert('Login success!');
                  afterLogin();
               }
               console.log(res);
            },
            complete: self.render.bind(self)
         });
         self.errorMessage = '';
         self.render();

      },

      render: function(){
         var self = this;
         this.$el.html(this.template({'errorMessage': self.errorMessage}))
      }

   });

   var GraderAppRouter = Backbone.Router.extend({

      //todo add more routes...
      routes: {
         "login": "login"
      },

      currentScreen: null,

      login: function() {
         $('main').html('');
         this.currentScreen = new LoginView({ el: $('main')});
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

      console.log("hello!");
      router.navigate('login', {trigger: true, replace: true});


   })
});