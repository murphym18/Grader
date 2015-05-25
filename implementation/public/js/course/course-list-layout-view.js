define(function (require) {
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    
    var HeaderNavView = require('util/header-nav-view');
    var CourseList = require('course/course-list');
    var CourseListView = require('course/course-list-view');
    var LoadingView = require('util/promise-loading-view');
    var BasicLayoutView = require('util/basic-layout-view');
    
    var userChannel = require('user/module');
    
    return BasicLayoutView.extend({
        initialize: function(options) {
            this.headerView = new HeaderNavView();
            if (options.courseListView)
                this.mainView = options.courseListView;
        },

        
        showAllCourses: function() {

        }
    });
});