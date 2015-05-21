/** @author Michael Murphy */
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
      'jquery-ui': ['jquery'],
      "jquery.magnific-popup" : ['jquery', 'jquery-ui']
   }
});

// Start the main app logic.


requirejs(['app/app', 'app/login', 'app/home', 'app/chart', 'app/modifyAssignment', 'app/modifyCategory', 'app/newAssignment','app/modifyClass', 'app/modifyStudent', 'domReady!'], function(app) {


   app.start({});
});
