define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    var UserCourseList = require('user/user-course-list');
    
    
    var LoginView = require('user/login-view')
    var Session = require('user/session');
    
    var session = new Session();
    var userCourses = new UserCourseList();

    function loginFunc() {
        var deferred = Q.defer();
        if (session.isAuthenticated()) {
            deferred.resolve(session.get('user'));
        }
        else {
            session.once('login', function(user) {
                App.PopupRegion.close();
                deferred.resolve(user);
            });
            App.PopupRegion.show(new LoginView());
        }
        return deferred.promise;
    };
       
    var userChannel = Radio.channel('user');
    session.on('all', userChannel.trigger.bind(userChannel));
    userChannel.reply('session', session);
    userChannel.comply('login', loginFunc);
    userChannel.reply('login', loginFunc);
    userChannel.reply('user', loginFunc);
    
    return userChannel;
});
