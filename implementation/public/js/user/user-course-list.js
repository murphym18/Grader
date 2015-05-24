define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    var userChannel = require('user/module');
    var CourseList = require('course/course-list');
    
    return CourseList.extend({
        updateUrl: function updateUserCourses() {
            if (this.user) {
                this.url = '/api/Users/'+ this.user.username +'/Courses';
            }
            else {
                this.url = "/api/Courses";
            }
        },
      
        initialize: function(options) {
            this.user = options.user;
            this.url = '/api/Users/'+ this.user.username +'/Courses';
            // this.listenTo(this.session, 'change:user', this.updateUrl);
            // this.listenTo(this.session, 'logout', this.clear);
            this.updateUrl();
        }
    });
});