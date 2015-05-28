define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var userChannel = require('user/module');
    var Radio = require('backbone.radio');
    var courseChannel = Radio.channel('course');
    var pageChannel = Radio.channel('page');
    var template = require('text!templates/headerCourseDropdownView.hbs');
    var CreateCourseView = require('course/view/new-course-view');
    var ManageCourseView = require('course/view/manage-course-view');



    return Mn.ItemView.extend({
        tagName: 'li',
        template: Hbs.compile(template),

        ui: {
            newClass: ".newClass",
            manageClass: ".manageClass",
            gradeScheme: ".gradeScheme",
            latePolicy: ".latePolicy",
            permissions: ".permissions",
            mockData: ".mockData"
        },

        events: {
            "click @ui.newClass": "showNewClass",
            "click @ui.manageClass": "showManageClass",
            "click @ui.gradeScheme": "showGradeScheme",
            "click @ui.latePolicy": "showLatePolicy",
            "click @ui.permissions": "showPermissions",
            "click @ui.mockdata": "createMockData"
        },

        initialize: function(options) {
            //this.model = userChannel.request('session');
        },

        showNewClass: function(domEvent) {
            //courseChannel.command('showAllCourses');
            userChannel.request('user').then(function(user) {
                //console.log('show new class');
                var modalRegion = pageChannel.request('modalRegion');
                modalRegion.show(new CreateCourseView({user: user}));

            })
        },

        showManageClass: function(domEvent) {
            //courseChannel.command('showUserCourses');
            userChannel.request('user').then(function(user) {
                //console.log('show new class');
                var modalRegion = pageChannel.request('modalRegion');
                modalRegion.show(new ManageCourseView({user: user}));

            })
        },

        showGradeScheme: function(domEvent) {
            //courseChannel.command('showUserCourses');
        },

        showLatePolicy: function(domEvent) {
            //courseChannel.command('showUserCourses');
        },

        showPermissions: function(domEvent) {
            //courseChannel.command('showUserCourses');
        },
        
        createMockData: function() {
            console.log('mock data created')
            var x = courseChannel.request('current:course');
            x.students.each(function(s){ 
                var a = [];
                _.each(x.categories.allAssignments, function(e) {
                    a.push({
                        assignment : e,
                        rawScore : _.random(50,100)
                    })
                s.attributes.grades = a;
            })})
            x.save();
            console.log('mock data created')
            //.then(function(){});
        }
    });
});

