define(['jquery', 'underscore', 'backbone', 'app/app'], function($, _, Backbone) {

   var SESSION_STORE_KEY = 'session';
   function loginAjaxSuccess(res, status, jqXHR) {

      if (res.login) {
//         var user = _.omit(res.user, 'password');
         delete res.user.password;
         this.set(res);
         this.afterLogin();
      }
      else {
         this.fetch();
         this.set(res);
      }
   }
   function logoutAjaxSuccess(res, status, jqXHR) {
      if (res.logout) {
         this.afterLogout();
      }
   }

   var Session = Backbone.Model.extend({
      idAttribute: "_id",
      defaults: {
         logout: true,
         login: false,
         message: '',
         user: null,
         username: '',
         password: ''
      },
      initialize: function() {
         this.fetch();
      },
      login: function() {
         var self = this;
         var payload = {username: self.get('username'), password: self.get('password')};
         $.ajax({
            url: '/api/login',
            data: payload,
            method: 'POST',
            headers: {
               Accept : "application/json; q=1"
            },
            success: function() {loginAjaxSuccess.apply(self, _.toArray(arguments));}
         });
         this.set({password:'', message: ''});
      },
      logout: function() {
         var self = this;
         $.ajax({
            url: '/api/logout',
            method: 'GET',
            success: function() {logoutAjaxSuccess.apply(self, _.toArray(arguments));}
         });
      },
      afterLogin: function () {
         var routesChannel = Backbone.Radio.channel('routes');
         this.save();
         this.trigger('login');
         routesChannel.command('/');
      },
      afterLogout: function () {
         var routesChannel = Backbone.Radio.channel('routes');
         this.reset();
         this.trigger('logout');
         routesChannel.command('/login');
      },
      isAuthenticated: function() {
         return this.get('login');
      },
      reset: function() {
         sessionStorage.removeItem(SESSION_STORE_KEY);
         this.clear();
         this.set(this.defaults);
      },
      save: function(attr, ops) {
         var data = _.clone(this.attributes);
         if (_.isObject(attr)) {
            _.extend(data, attr);
            if (ops && !ops.wait) {
               this.set(attr);
            }
         }
         data = JSON.stringify(data);
         if (ops && ops.wait) {
            sessionStorage.setItem(SESSION_STORE_KEY, data);
            this.set(attr);
         }
         else {
            sessionStorage.setItem(SESSION_STORE_KEY, data);
         }
      },
      fetch: function() {
         this.set(JSON.parse(sessionStorage.getItem(SESSION_STORE_KEY)));
      }
   });

   return new Session({});
});
