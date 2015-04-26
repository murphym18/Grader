define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
   function loginAjaxSuccess(res, status, jqXHR) {
      this.set(res);
      if (res.login) {
         this.afterLogin();
      }
      else {
         this.set({'username': ''});
      }
   }
   function logoutAjaxSuccess(res, status, jqXHR) {
      this.set(res);
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
         $.ajax({
            url: '/api/logout',
            method: 'GET',
            success: function() {logoutAjaxSuccess.apply(self, _.toArray(arguments));}
         });
      },
      afterLogin: function () {
         this.trigger('login');
      },
      afterLogout: function () {
         this.trigger('logout');
      },
      isAuthenticated: function() {
         return this.get('login');
      }
   });

   return new Session({});
});
